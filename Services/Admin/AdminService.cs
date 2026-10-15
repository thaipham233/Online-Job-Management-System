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
                    COUNT(*) FILTER (WHERE ""Role"" = 'Candidate') as Candidates,
                    COUNT(*) FILTER (WHERE ""Role"" = 'Employer') as Employers,
                    COUNT(*) FILTER (WHERE ""Role"" = 'Admin') as Admins,
                    COUNT(*) FILTER (WHERE ""CreatedAt"" >= @startOfMonth) as NewThisMonth
                FROM ""Users""";
            return await connection.QuerySingleAsync<UserStatsDto>(sql, new { startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1) });
        }

        public async Task<CompanyStatsDto> GetCompanyStatsAsync()
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    COUNT(*) as Total,
                    COUNT(*) FILTER (WHERE ""IsVerified"" = true) as Verified,
                    COUNT(*) FILTER (WHERE ""IsVerified"" = false) as Pending,
                    COUNT(*) FILTER (WHERE ""CreatedAt"" >= @startOfMonth) as NewThisMonth
                FROM ""Companies""";
            return await connection.QuerySingleAsync<CompanyStatsDto>(sql, new { startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1) });
        }

        public async Task<JobStatsDto> GetJobStatsAsync()
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    COUNT(*) as Total,
                    COUNT(*) FILTER (WHERE ""Status"" = 'Open') as Open,
                    COUNT(*) FILTER (WHERE ""Status"" = 'Closed') as Closed,
                    COUNT(*) FILTER (WHERE ""Status"" = 'Draft') as Draft,
                    COUNT(*) FILTER (WHERE ""CreatedAt"" >= @startOfMonth) as NewThisMonth
                FROM ""Jobs""";
            return await connection.QuerySingleAsync<JobStatsDto>(sql, new { startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1) });
        }

        public async Task<ApplicationStatsDto> GetApplicationStatsAsync()
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    COUNT(*) as Total,
                    COUNT(*) FILTER (WHERE ""Status"" = 'Pending') as Pending,
                    COUNT(*) FILTER (WHERE ""Status"" IN ('Reviewed', 'Interviewing', 'Accepted')) as Processed,
                    COUNT(*) FILTER (WHERE ""AppliedAt"" >= @startOfMonth) as NewThisMonth
                FROM ""Applications""";
            return await connection.QuerySingleAsync<ApplicationStatsDto>(sql, new { startOfMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1) });
        }

        // Users
        public async Task<PagedResult<AdminUserListDto>> GetUsersAsync(AdminUserQueryDto query)
        {
            using var connection = CreateConnection();
            var where = new List<string> { };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("(\"Email\" ILIKE @search OR \"FullName\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            if (!string.IsNullOrEmpty(query.Role))
            {
                where.Add("\"Role\" = @role");
                parameters.Add("role", query.Role);
            }

            if (query.IsActive.HasValue)
            {
                where.Add("\"IsActive\" = @isActive");
                parameters.Add("isActive", query.IsActive.Value);
            }

            var whereClause = where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "";
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Users"" {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT ""Id"", ""Email"", ""FullName"", ""PhoneNumber"", ""AvatarUrl"", ""Role"", ""IsActive"", ""CreatedAt"", ""UpdatedAt""
                FROM ""Users""
                {whereClause}
                ORDER BY ""CreatedAt"" DESC
                LIMIT @pageSize OFFSET @offset";

            parameters.Add("pageSize", query.PageSize);
            parameters.Add("offset", offset);

            var users = await connection.QueryAsync<AdminUserListDto>(dataSql, parameters);

            return new PagedResult<AdminUserListDto>
            {
                Items = users.ToList(),
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<AdminUserDetailDto?> GetUserByIdAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT u.*, c.""Name"" as CompanyName
                FROM ""Users"" u
                LEFT JOIN ""Companies"" c ON c.""OwnerId"" = u.""Id""
                WHERE u.""Id"" = @userId";
            return await connection.QuerySingleOrDefaultAsync<AdminUserDetailDto>(sql, new { userId });
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
            using var connection = CreateConnection();
            var role = roles.FirstOrDefault() ?? "Candidate";
            var sql = @"UPDATE ""Users"" SET ""Role"" = @role, ""UpdatedAt"" = @now WHERE ""Id"" = @userId";
            var rows = await connection.ExecuteAsync(sql, new { userId, role, now = DateTime.UtcNow });
            return rows > 0;
        }

        // Companies
        public async Task<PagedResult<AdminCompanyListDto>> GetCompaniesAsync(AdminCompanyQueryDto query)
        {
            using var connection = CreateConnection();
            var where = new List<string> { };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("(\"Name\" ILIKE @search OR \"Email\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            if (query.IsVerified.HasValue)
            {
                where.Add("\"IsVerified\" = @isVerified");
                parameters.Add("isVerified", query.IsVerified.Value);
            }

            var whereClause = where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "";
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Companies"" {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT c.""Id"", c.""Name"", c.""LogoUrl"", c.""Email"", c.""Website"", c.""Industry"", c.""Size"", c.""IsVerified"", 
                       (SELECT COUNT(*) FROM ""Jobs"" WHERE ""CompanyId"" = c.""Id"") as JobsCount, c.""CreatedAt""
                FROM ""Companies"" c
                {whereClause}
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
                WHERE c.""Id"" = @companyId";
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
            var where = new List<string> { };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("(\"Title\" ILIKE @search OR c.\"Name\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            if (!string.IsNullOrEmpty(query.Status))
            {
                where.Add("j.\"Status\" = @status");
                parameters.Add("status", query.Status);
            }

            if (query.CompanyId.HasValue)
            {
                where.Add("j.\"CompanyId\" = @companyId");
                parameters.Add("companyId", query.CompanyId.Value);
            }

            var whereClause = where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "";
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Jobs"" j LEFT JOIN ""Companies"" c ON c.""Id"" = j.""CompanyId"" {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT j.""Id"", j.""Title"", c.""Name"" as CompanyName, j.""JobType"", j.""ExperienceLevel"", j.""SalaryMin"", j.""SalaryMax"", j.""SalaryType"", j.""Status"", j.""IsHot"", 
                       (SELECT COUNT(*) FROM ""Applications"" WHERE ""JobId"" = j.""Id"") as ApplicationsCount,
                       (SELECT COUNT(*) FROM ""JobViews"" WHERE ""JobId"" = j.""Id"") as ViewsCount,
                       j.""CreatedAt"", j.""ExpiresAt""
                FROM ""Jobs"" j
                LEFT JOIN ""Companies"" c ON c.""Id"" = j.""CompanyId""
                {whereClause}
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
            var sql = @"DELETE FROM ""Jobs"" WHERE ""Id"" = @jobId";
            var rows = await connection.ExecuteAsync(sql, new { jobId });
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
                where.Add("(\"Name\" ILIKE @search OR \"Description\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            var whereClause = where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "";
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Categories"" {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT c.""Id"", c.""Name"", c.""Description"", c.""IconClass"", c.""IconColor"", c.""DisplayOrder"", 
                       (SELECT COUNT(*) FROM ""Jobs"" WHERE ""CategoryId"" = c.""Id"") as JobsCount, c.""CreatedAt""
                FROM ""Categories"" c
                {whereClause}
                ORDER BY c.""DisplayOrder"", c.""CreatedAt""
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

        public async Task<AdminCategoryDetailDto> CreateCategoryAsync(AdminCreateCategoryDto dto)
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

        public async Task<AdminCategoryDetailDto?> UpdateCategoryAsync(int categoryId, AdminUpdateCategoryDto dto)
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

        // Applications
        public async Task<PagedResult<AdminApplicationListDto>> GetApplicationsAsync(AdminApplicationQueryDto query)
        {
            using var connection = CreateConnection();
            var where = new List<string> { };
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(query.Search))
            {
                where.Add("(a.\"CoverLetter\" ILIKE @search OR j.\"Title\" ILIKE @search OR u.\"FullName\" ILIKE @search OR u.\"Email\" ILIKE @search)");
                parameters.Add("search", $"%{query.Search}%");
            }

            if (!string.IsNullOrEmpty(query.Status))
            {
                where.Add("a.\"Status\" = @status");
                parameters.Add("status", query.Status);
            }

            if (query.JobId.HasValue)
            {
                where.Add("a.\"JobId\" = @jobId");
                parameters.Add("jobId", query.JobId.Value);
            }

            if (query.CompanyId.HasValue)
            {
                where.Add("j.\"CompanyId\" = @companyId");
                parameters.Add("companyId", query.CompanyId.Value);
            }

            var whereClause = where.Count > 0 ? "WHERE " + string.Join(" AND ", where) : "";
            var offset = (query.PageNumber - 1) * query.PageSize;

            var countSql = $@"SELECT COUNT(*) FROM ""Applications"" a
                LEFT JOIN ""Jobs"" j ON j.""Id"" = a.""JobId""
                LEFT JOIN ""Users"" u ON u.""Id"" = a.""UserId""
                {whereClause}";
            var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

            var dataSql = $@"
                SELECT 
                    a.""Id"", j.""Title"" as JobTitle, c.""Name"" as CompanyName,
                    u.""FullName"" as CandidateName, u.""Email"" as CandidateEmail,
                    a.""Status"", a.""AppliedAt"", a.""ReviewedAt"",
                    a.""CoverLetter"", a.""ResumeUrl""
                FROM ""Applications"" a
                LEFT JOIN ""Jobs"" j ON j.""Id"" = a.""JobId""
                LEFT JOIN ""Companies"" c ON c.""Id"" = j.""CompanyId""
                LEFT JOIN ""Users"" u ON u.""Id"" = a.""UserId""
                {whereClause}
                ORDER BY a.""AppliedAt"" DESC
                LIMIT @pageSize OFFSET @offset";

            parameters.Add("pageSize", query.PageSize);
            parameters.Add("offset", offset);

            var applications = await connection.QueryAsync<AdminApplicationListDto>(dataSql, parameters);

            return new PagedResult<AdminApplicationListDto>
            {
                Items = applications.ToList(),
                TotalCount = totalCount,
                PageNumber = query.PageNumber,
                PageSize = query.PageSize
            };
        }

        public async Task<AdminApplicationDetailDto?> GetApplicationByIdAsync(int applicationId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT 
                    a.*, j.""Title"" as JobTitle, c.""Name"" as CompanyName, j.""Id"" as JobId,
                    u.""FullName"" as CandidateName, u.""Email"" as CandidateEmail,
                    u.""PhoneNumber"" as CandidatePhone, u.""Address"" as CandidateAddress
                FROM ""Applications"" a
                LEFT JOIN ""Jobs"" j ON j.""Id"" = a.""JobId""
                LEFT JOIN ""Companies"" c ON c.""Id"" = j.""CompanyId""
                LEFT JOIN ""Users"" u ON u.""Id"" = a.""UserId""
                WHERE a.""Id"" = @applicationId";
            
            return await connection.QuerySingleOrDefaultAsync<AdminApplicationDetailDto>(sql, new { applicationId });
        }

        public async Task<bool> UpdateApplicationStatusAsync(int applicationId, AdminUpdateApplicationStatusDto dto)
        {
            using var connection = CreateConnection();
            var sql = @"
                UPDATE ""Applications"" 
                SET ""Status"" = @status, ""ReviewedAt"" = @now, ""RejectionReason"" = @rejectionReason, ""Note"" = @note, ""UpdatedAt"" = @now
                WHERE ""Id"" = @applicationId";
            
            var rows = await connection.ExecuteAsync(sql, new
            {
                applicationId,
                status = dto.Status,
                rejectionReason = dto.RejectionReason,
                note = dto.Note,
                now = DateTime.UtcNow
            });
            return rows > 0;
        }
    }
}
