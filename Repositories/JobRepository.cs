using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class JobRepository : GenericRepository<Job>, IJobRepository
    {
        public JobRepository(IConfiguration configuration) : base(configuration) { }

        public async Task<Job?> GetWithDetailsAsync(int jobId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT j.*, c.*, cat.*, u.*
                FROM Jobs j
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                LEFT JOIN Users u ON u.Id = j.CreatedByUserId
                WHERE j.Id = @JobId";
            
            Job? job = null;
            await connection.QueryAsync<Job, Company, Category, User, Job>(sql,
                (j, c, cat, u) =>
                {
                    job = j;
                    job.Company = c;
                    job.Category = cat;
                    job.CreatedByUser = u;
                    return job;
                },
                new { JobId = jobId },
                splitOn: "Id,Id,Id");
            
            return job;
        }

        public async Task<IEnumerable<Job>> GetByCompanyAsync(int companyId, int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT * FROM Jobs 
                WHERE CompanyId = @CompanyId
                ORDER BY CreatedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            return await connection.QueryAsync<Job>(sql, new { CompanyId = companyId, Skip = skip, Take = take });
        }

        public async Task<IEnumerable<Job>> GetPublishedJobsAsync(int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT j.*, c.*, cat.*
                FROM Jobs j
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                WHERE j.Status = @Status 
                AND (j.ExpiredDate IS NULL OR j.ExpiredDate > GETUTCDATE())
                ORDER BY COALESCE(j.PublishedAt, j.CreatedAt) DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            return await connection.QueryAsync<Job, Company, Category, Job>(sql,
                (j, c, cat) =>
                {
                    j.Company = c;
                    j.Category = cat;
                    return j;
                },
                new { Status = (int)JobStatus.Published, Skip = skip, Take = take },
                splitOn: "Id,Id");
        }

        public async Task<IEnumerable<Job>> SearchJobsAsync(
            string? keyword, 
            int? categoryId, 
            JobType? jobType, 
            ExperienceLevel? experienceLevel, 
            decimal? salaryMin, 
            string? location, 
            int skip = 0, 
            int take = 10)
        {
            using var connection = CreateConnection();
            var where = new List<string> { "j.Status = @Status", "(j.ExpiredDate IS NULL OR j.ExpiredDate > GETUTCDATE())" };
            var parameters = new DynamicParameters();
            parameters.Add("Status", (int)JobStatus.Published);
            parameters.Add("Skip", skip);
            parameters.Add("Take", take);

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                where.Add("(j.Title LIKE @Keyword OR j.Description LIKE @Keyword OR j.Requirements LIKE @Keyword OR c.Name LIKE @Keyword)");
                parameters.Add("Keyword", $"%{keyword}%");
            }

            if (categoryId.HasValue)
            {
                where.Add("j.CategoryId = @CategoryId");
                parameters.Add("CategoryId", categoryId.Value);
            }

            if (jobType.HasValue)
            {
                where.Add("j.JobType = @JobType");
                parameters.Add("JobType", (int)jobType.Value);
            }

            if (experienceLevel.HasValue)
            {
                where.Add("j.ExperienceLevel = @ExperienceLevel");
                parameters.Add("ExperienceLevel", (int)experienceLevel.Value);
            }

            if (salaryMin.HasValue)
            {
                where.Add("j.SalaryMax >= @SalaryMin");
                parameters.Add("SalaryMin", salaryMin.Value);
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                where.Add("j.Location LIKE @Location");
                parameters.Add("Location", $"%{location}%");
            }

            var whereClause = string.Join(" AND ", where);
            var sql = $@"
                SELECT j.*, c.*, cat.*
                FROM Jobs j
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                WHERE {whereClause}
                ORDER BY COALESCE(j.PublishedAt, j.CreatedAt) DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            return await connection.QueryAsync<Job, Company, Category, Job>(sql,
                (j, c, cat) =>
                {
                    j.Company = c;
                    j.Category = cat;
                    return j;
                },
                parameters,
                splitOn: "Id,Id");
        }

        public async Task<IEnumerable<Job>> GetFeaturedJobsAsync(int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT j.*, c.*, cat.*
                FROM Jobs j
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                WHERE j.Status = @Status 
                AND (j.ExpiredDate IS NULL OR j.ExpiredDate > GETUTCDATE())
                ORDER BY j.ViewCount DESC";
            
            return await connection.QueryAsync<Job, Company, Category, Job>(sql,
                (j, c, cat) =>
                {
                    j.Company = c;
                    j.Category = cat;
                    return j;
                },
                new { Status = (int)JobStatus.Published, Take = take },
                splitOn: "Id,Id");
        }

        public async Task<IEnumerable<Job>> GetRecentJobsAsync(int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT j.*, c.*, cat.*
                FROM Jobs j
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                WHERE j.Status = @Status 
                AND (j.ExpiredDate IS NULL OR j.ExpiredDate > GETUTCDATE())
                ORDER BY COALESCE(j.PublishedAt, j.CreatedAt) DESC";
            
            return await connection.QueryAsync<Job, Company, Category, Job>(sql,
                (j, c, cat) =>
                {
                    j.Company = c;
                    j.Category = cat;
                    return j;
                },
                new { Status = (int)JobStatus.Published, Take = take },
                splitOn: "Id,Id");
        }

        public async Task IncrementViewCountAsync(int jobId)
        {
            using var connection = CreateConnection();
            await connection.ExecuteAsync(
                "UPDATE Jobs SET ViewCount = ViewCount + 1 WHERE Id = @JobId", 
                new { JobId = jobId });
        }

        public async Task<int> GetTotalPublishedCountAsync()
        {
            using var connection = CreateConnection();
            return await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM Jobs WHERE Status = @Status AND (ExpiredDate IS NULL OR ExpiredDate > GETUTCDATE())",
                new { Status = (int)JobStatus.Published });
        }
    }
}
