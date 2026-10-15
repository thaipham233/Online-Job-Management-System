using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using Online_Job_Management_System.DTOs.Admin;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly IJobRepository _jobRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IApplicationRepository _applicationRepository;
        private readonly string _connectionString;

        public AdminService(
            IUserRepository userRepository,
            ICompanyRepository companyRepository,
            IJobRepository jobRepository,
            ICategoryRepository categoryRepository,
            IApplicationRepository applicationRepository,
            IConfiguration configuration)
        {
            _userRepository = userRepository;
            _companyRepository = companyRepository;
            _jobRepository = jobRepository;
            _categoryRepository = categoryRepository;
            _applicationRepository = applicationRepository;
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found");
        }

        private IDbConnection CreateConnection() => new SqlConnection(_connectionString);

        // Stats
        public async Task<AdminStatsDto> GetDashboardStatsAsync()
        {
            var stats = new AdminStatsDto
            {
                Users = await GetUserStatsAsync(),
                Companies = await GetCompanyStatsAsync(),
                Jobs = await GetJobStatsAsync(),
                Applications = await GetApplicationStatsAsync()
            };
            return stats;
        }

        public async Task<UserStatsDto> GetUserStatsAsync()
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    COUNT(*) as Total,
                    COUNT(CASE WHEN u.""Role"" = 'Candidate' THEN 1 END) as Candidates,
                    COUNT(CASE WHEN u.""Role"" = 'Employer' THEN 1 END) as Employers,
                    COUNT(CASE WHEN u.""Role"" = 'Admin' THEN 1 END) as Admins,
                    COUNT(CASE WHEN u.""CreatedAt"" >= @startOfMonth THEN 1 END) as NewThisMonth
                FROM ""Users"" u
                WHERE u.""IsDeleted"" = false";
            
            var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var result = await connection.QuerySingleAsync<UserStatsDto>(sql, new { startOfMonth });
            return result ?? new UserStatsDto();
        }

        public async Task<CompanyStatsDto> GetCompanyStatsAsync()
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    COUNT(*) as Total,
                    COUNT(CASE WHEN c.""IsVerified"" = true THEN 1 END) as Verified,
                    COUNT(CASE WHEN c.""IsVerified"" = false THEN 1 END) as Pending,
                    COUNT(CASE WHEN c.""CreatedAt"" >= @startOfMonth THEN 1 END) as NewThisMonth
                FROM ""Companies"" c
                WHERE c.""IsDeleted"" = false";
            
            var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var result = await connection.QuerySingleAsync<CompanyStatsDto>(sql, new { startOfMonth });
            return result ?? new CompanyStatsDto();
        }

        public async Task<JobStatsDto> GetJobStatsAsync()
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    COUNT(*) as Total,
                    COUNT(CASE WHEN j.""Status"" = 'Open' THEN 1 END) as Open,
                    COUNT(CASE WHEN j.""Status"" = 'Closed' THEN 1 END) as Closed,
                    COUNT(CASE WHEN j.""Status"" = 'Draft' THEN 1 END) as Draft,
                    COUNT(CASE WHEN j.""CreatedAt"" >= @startOfMonth THEN 1 END) as NewThisMonth
                FROM ""Jobs"" j
                WHERE j.""IsDeleted"" = false";
            
            var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var result = await connection.QuerySingleAsync<JobStatsDto>(sql, new { startOfMonth });
            return result ?? new JobStatsDto();
        }

        public async Task<ApplicationStatsDto> GetApplicationStatsAsync()
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    COUNT(*) as Total,
                    COUNT(CASE WHEN a.""Status"" = 'Pending' THEN 1 END) as Pending,
                    COUNT(CASE WHEN a.""Status"" IN ('Reviewed', 'Interviewing', 'Accepted', 'Rejected') THEN 1 END) as Processed,
                    COUNT(CASE WHEN a.""CreatedAt"" >= @startOfMonth THEN 1 END) as NewThisMonth
                FROM ""Applications"" a
                WHERE a.""IsDeleted"" = false";
            
            var startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);
            var result = await connection.QuerySingleAsync<ApplicationStatsDto>(sql, new { startOfMonth });
            return result ?? new ApplicationStatsDto();
        }

        // Users
        public async Task<PagedResult<AdminUserListDto>> GetUsersAsync(AdminUserQueryDto query)
        {
            using var connection = CreateConnection();
            var where = new List<string> { "u.\"IsDeleted\" = false" };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Role))
            {
                where.Add("u.\"Role\" = @role");
                parameters.Add("role", query.Role);
            }

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("(u.\"Email\" ILIKE @search OR u.\"FullName\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            if (!string.IsNullOrEmpty(query.Status))
            {
                where.Add("u.\"IsActive\" = @isActive");
                parameters.Add("isActive", query.Status == "Active");
            }

            var whereClause = string.Join(" AND ", where);
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Users"" u WHERE {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT 
                    u.""Id"", u.""Email"", u.""FullName"", u.""PhoneNumber"", u.""AvatarUrl"",
                    u.""Role"", u.""IsActive"", u.""CreatedAt"", u.""UpdatedAt""
                FROM ""Users"" u
                WHERE {whereClause}
                ORDER BY u.""CreatedAt"" DESC
                LIMIT @pageSize OFFSET @offset";

            parameters.Add("pageSize", query.PageSize);
            parameters.Add("offset", offset);

            var users = await connection.QueryAsync<AdminUserListDto>(dataSql, parameters);
            
            // Parse roles (assuming single role stored in Role column)
            var userList = users.Select(u => 
            {
                u.Roles = new List<string> { u.Roles.FirstOrDefault() ?? "Candidate" }.Where(r => !string.IsNullOrEmpty(r)).ToList();
                return u;
            }).ToList();

            return new PagedResult<AdminUserListDto>
            {
                Items = userList,
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<AdminUserDetailDto?> GetUserByIdAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    u.*, c.""Name"" as CompanyName, c.""Id"" as CompanyId
                FROM ""Users"" u
                LEFT JOIN ""Companies"" c ON c.""OwnerId"" = u.""Id""
                WHERE u.""Id"" = @userId AND u.""IsDeleted"" = false";
            
            var user = await connection.QuerySingleOrDefaultAsync<AdminUserDetailDto>(sql, new { userId });
            if (user != null)
            {
                user.Roles = new List<string> { user.Roles.FirstOrDefault() ?? "Candidate" }.Where(r => !string.IsNullOrEmpty(r)).ToList();
            }
            return user;
        }

        public async Task<bool> UpdateUserStatusAsync(int userId, bool isActive)
        {
            using var connection = CreateConnection();
            var sql = @"UPDATE ""Users"" SET ""IsActive"" = @isActive, ""UpdatedAt"" = @now WHERE ""Id"" = @userId";
            var rows = await connection.ExecuteAsync(sql, new { userId, isActive, now = DateTime.UtcNow });
            return rows > 0;
        }

        public async Task<bool> UpdateUserRolesAsync(int userId, List<string> roles)
        {
            var primaryRole = roles.FirstOrDefault() ?? "Candidate";
            using var connection = CreateConnection();
            var sql = @"UPDATE ""Users"" SET ""Role"" = @role, ""UpdatedAt"" = @now WHERE ""Id"" = @userId";
            var rows = await connection.ExecuteAsync(sql, new { userId, role = primaryRole, now = DateTime.UtcNow });
            return rows > 0;
        }

        // Companies
        public async Task<PagedResult<AdminCompanyListDto>> GetCompaniesAsync(AdminCompanyQueryDto query)
        {
            using var connection = CreateConnection();
            var where = new List<string> { "c.\"IsDeleted\" = false" };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("(c.\"Name\" ILIKE @search OR c.\"Email\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            if (query.Verified.HasValue)
            {
                where.Add("c.\"IsVerified\" = @verified");
                parameters.Add("verified", query.Verified.Value);
            }

            var whereClause = string.Join(" AND ", where);
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Companies"" c WHERE {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT 
                    c.""Id"", c.""Name"", c.""LogoUrl"", c.""Email"", c.""Website"",
                    c.""Industry"", c.""Size"", c.""IsVerified"", c.""CreatedAt"",
                    (SELECT COUNT(*) FROM ""Jobs"" j WHERE j.""CompanyId"" = c.""Id"" AND j.""IsDeleted"" = false) as JobsCount
                FROM ""Companies"" c
                WHERE {whereClause}
                ORDER BY c.""CreatedAt"" DESC
                LIMIT @pageSize OFFSET @offset";

            parameters.Add("pageSize", query.PageSize);
            parameters.Add("offset", offset);

            var companies = await connection.QueryAsync<AdminCompanyListDto>(dataSql, parameters);

            return new PagedResult<AdminCompanyListDto>
            {
                Items = companies.ToList(),
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<AdminCompanyDetailDto?> GetCompanyByIdAsync(int companyId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT c.*, u.""Email"" as OwnerEmail
                FROM ""Companies"" c
                LEFT JOIN ""Users"" u ON u.""Id"" = c.""OwnerId""
                WHERE c.""Id"" = @companyId AND c.""IsDeleted"" = false";
            
            return await connection.QuerySingleOrDefaultAsync<AdminCompanyDetailDto>(sql, new { companyId });
        }

        public async Task<bool> VerifyCompanyAsync(int companyId, bool isVerified)
        {
            using var connection = CreateConnection();
            var sql = @"UPDATE ""Companies"" SET ""IsVerified"" = @isVerified, ""UpdatedAt"" = @now WHERE ""Id"" = @companyId";
            var rows = await connection.ExecuteAsync(sql, new { companyId, isVerified, now = DateTime.UtcNow });
            return rows > 0;
        }

        // Jobs
        public async Task<PagedResult<AdminJobListDto>> GetJobsAsync(AdminJobQueryDto query)
        {
            using var connection = CreateConnection();
            var where = new List<string> { "j.\"IsDeleted\" = false" };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("(j.\"Title\" ILIKE @search OR c.\"Name\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            if (!string.IsNullOrEmpty(query.Status))
            {
                where.Add("j.\"Status\" = @status");
                parameters.Add("status", query.Status);
            }

            var whereClause = string.Join(" AND ", where);
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Jobs"" j LEFT JOIN ""Companies"" c ON c.""Id"" = j.""CompanyId"" WHERE {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT 
                    j.""Id"", j.""Title"", c.""Name"" as CompanyName,
                    j.""JobType"", j.""ExperienceLevel"", j.""SalaryMin"", j.""SalaryMax"",
                    j.""SalaryType"", j.""Status"", j.""IsHot"", j.""CreatedAt"", j.""ExpiresAt"",
                    (SELECT COUNT(*) FROM ""Applications"" a WHERE a.""JobId"" = j.""Id"" AND a.""IsDeleted"" = false) as ApplicationsCount,
                    j.""ViewsCount""
                FROM ""Jobs"" j
                LEFT JOIN ""Companies"" c ON c.""Id"" = j.""CompanyId""
                WHERE {whereClause}
                ORDER BY j.""CreatedAt"" DESC
                LIMIT @pageSize OFFSET @offset";

            parameters.Add("pageSize", query.PageSize);
            parameters.Add("offset", offset);

            var jobs = await connection.QueryAsync<AdminJobListDto>(dataSql, parameters);

            return new PagedResult<AdminJobListDto>
            {
                Items = jobs.ToList(),
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<bool> UpdateJobStatusAsync(int jobId, string status)
        {
            using var connection = CreateConnection();
            var sql = @"UPDATE ""Jobs"" SET ""Status"" = @status, ""UpdatedAt"" = @now WHERE ""Id"" = @jobId";
            var rows = await connection.ExecuteAsync(sql, new { jobId, status, now = DateTime.UtcNow });
            return rows > 0;
        }

        public async Task<bool> DeleteJobAsync(int jobId)
        {
            using var connection = CreateConnection();
            var sql = @"UPDATE ""Jobs"" SET ""IsDeleted"" = true, ""UpdatedAt"" = @now WHERE ""Id"" = @jobId";
            var rows = await connection.ExecuteAsync(sql, new { jobId, now = DateTime.UtcNow });
            return rows > 0;
        }

        // Categories
        public async Task<PagedResult<AdminCategoryListDto>> GetCategoriesAsync(AdminCategoryQueryDto query)
        {
            using var connection = CreateConnection();
            var where = new List<string> { };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("cat.\"Name\" ILIKE @search");
                parameters.Add("search", $"%{query.Search}%");
            }

            var whereClause = where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "";
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Categories"" cat {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT 
                    cat.""Id"", cat.""Name"", cat.""Description"", cat.""IconClass"",
                    cat.""IconColor"", cat.""DisplayOrder"", cat.""CreatedAt"",
                    (SELECT COUNT(*) FROM ""Jobs"" j WHERE j.""CategoryId"" = cat.""Id"" AND j.""IsDeleted"" = false) as JobsCount
                FROM ""Categories"" cat
                {whereClause}
                ORDER BY cat.""DisplayOrder"", cat.""Name""
                LIMIT @pageSize OFFSET @offset";

            parameters.Add("pageSize", query.PageSize);
            parameters.Add("offset", offset);

            var categories = await connection.QueryAsync<AdminCategoryListDto>(dataSql, parameters);

            return new PagedResult<AdminCategoryListDto>
            {
                Items = categories.ToList(),
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<AdminCategoryDetailDto?> GetCategoryByIdAsync(int categoryId)
        {
            using var connection = CreateConnection();
            var sql = @"SELECT * FROM ""Categories"" WHERE ""Id"" = @categoryId";
            return await connection.QuerySingleOrDefaultAsync<AdminCategoryDetailDto>(sql, new { categoryId });
        }

        public async Task<AdminCategoryDetailDto> CreateCategoryAsync(CreateCategoryDto dto)
        {
            using var connection = CreateConnection();
            var sql = @"
                INSERT INTO ""Categories"" (""Name"", ""Description"", ""IconClass"", ""IconColor"", ""DisplayOrder"", ""CreatedAt"")
                VALUES (@Name, @Description, @IconClass, @IconColor, @DisplayOrder, @CreatedAt)
                RETURNING *";
            
            return await connection.QuerySingleAsync<AdminCategoryDetailDto>(sql, new
            {
                dto.Name,
                dto.Description,
                dto.IconClass,
                dto.IconColor,
                dto.DisplayOrder,
                CreatedAt = DateTime.UtcNow
            });
        }

        public async Task<AdminCategoryDetailDto?> UpdateCategoryAsync(int categoryId, UpdateCategoryDto dto)
        {
            using var connection = CreateConnection();
            var sql = @"
                UPDATE ""Categories"" 
                SET ""Name"" = @Name, ""Description"" = @Description, ""IconClass"" = @IconClass,
                    ""IconColor"" = @IconColor, ""DisplayOrder"" = @DisplayOrder, ""UpdatedAt"" = @now
                WHERE ""Id"" = @categoryId
                RETURNING *";
            
            return await connection.QuerySingleOrDefaultAsync<AdminCategoryDetailDto>(sql, new
            {
                categoryId,
                dto.Name,
                dto.Description,
                dto.IconClass,
                dto.IconColor,
                dto.DisplayOrder,
                now = DateTime.UtcNow
            });
        }

        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            using var connection = CreateConnection();
            var sql = @"DELETE FROM ""Categories"" WHERE ""Id"" = @categoryId";
            var rows = await connection.ExecuteAsync(sql, new { categoryId });
            return rows > 0;
        }
    }
}
