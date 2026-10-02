using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class ApplicationRepository : GenericRepository<Application>, IApplicationRepository
    {
        public ApplicationRepository(string connectionString) : base(connectionString) { }

        public async Task<Application?> GetWithDetailsAsync(int applicationId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT a.*, u.*, r.*, j.*, c.*, cat.*
                FROM Applications a
                LEFT JOIN Users u ON u.Id = a.UserId
                LEFT JOIN Resumes r ON r.Id = a.ResumeId
                LEFT JOIN Jobs j ON j.Id = a.JobId
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                WHERE a.Id = @ApplicationId";
            
            Application? application = null;
            await connection.QueryAsync<Application, User, Resume, Job, Company, Category, Application>(sql,
                (a, u, r, j, c, cat) =>
                {
                    application = a;
                    application.User = u;
                    application.Resume = r;
                    if (j != null && j.Id > 0)
                    {
                        j.Company = c;
                        j.Category = cat;
                        application.Job = j;
                    }
                    return application;
                },
                new { ApplicationId = applicationId },
                splitOn: "Id,Id,Id,Id,Id");
            
            return application;
        }

        public async Task<IEnumerable<Application>> GetByJobAsync(int jobId, int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT a.*, u.*, r.*
                FROM Applications a
                LEFT JOIN Users u ON u.Id = a.UserId
                LEFT JOIN Resumes r ON r.Id = a.ResumeId
                WHERE a.JobId = @JobId
                ORDER BY a.AppliedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            return await connection.QueryAsync<Application, User, Resume, Application>(sql,
                (a, u, r) =>
                {
                    a.User = u;
                    a.Resume = r;
                    return a;
                },
                new { JobId = jobId, Skip = skip, Take = take },
                splitOn: "Id,Id");
        }

        public async Task<IEnumerable<Application>> GetByUserAsync(int userId, int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT a.*, j.*, c.*, cat.*
                FROM Applications a
                LEFT JOIN Jobs j ON j.Id = a.JobId
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                WHERE a.UserId = @UserId
                ORDER BY a.AppliedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            return await connection.QueryAsync<Application, Job, Company, Category, Application>(sql,
                (a, j, c, cat) =>
                {
                    if (j != null && j.Id > 0)
                    {
                        j.Company = c;
                        j.Category = cat;
                        a.Job = j;
                    }
                    return a;
                },
                new { UserId = userId, Skip = skip, Take = take },
                splitOn: "Id,Id,Id");
        }

        public async Task<IEnumerable<Application>> GetByCompanyAsync(int companyId, int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT a.*, u.*, r.*, j.*
                FROM Applications a
                LEFT JOIN Users u ON u.Id = a.UserId
                LEFT JOIN Resumes r ON r.Id = a.ResumeId
                LEFT JOIN Jobs j ON j.Id = a.JobId
                WHERE j.CompanyId = @CompanyId
                ORDER BY a.AppliedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            return await connection.QueryAsync<Application, User, Resume, Job, Application>(sql,
                (a, u, r, j) =>
                {
                    a.User = u;
                    a.Resume = r;
                    a.Job = j;
                    return a;
                },
                new { CompanyId = companyId, Skip = skip, Take = take },
                splitOn: "Id,Id,Id");
        }

        public async Task<IEnumerable<Application>> GetByStatusAsync(ApplicationStatus status, int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT a.*, j.*, c.*, u.*
                FROM Applications a
                LEFT JOIN Jobs j ON j.Id = a.JobId
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Users u ON u.Id = a.UserId
                WHERE a.Status = @Status
                ORDER BY a.AppliedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            return await connection.QueryAsync<Application, Job, Company, User, Application>(sql,
                (a, j, c, u) =>
                {
                    if (j != null && j.Id > 0)
                    {
                        j.Company = c;
                        a.Job = j;
                    }
                    a.User = u;
                    return a;
                },
                new { Status = (int)status, Skip = skip, Take = take },
                splitOn: "Id,Id,Id");
        }

        public async Task<Application?> GetUserApplicationForJobAsync(int userId, int jobId)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Application>(
                "SELECT * FROM Applications WHERE UserId = @UserId AND JobId = @JobId",
                new { UserId = userId, JobId = jobId });
        }

        public async Task<int> GetCountByJobAsync(int jobId)
        {
            using var connection = CreateConnection();
            return await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM Applications WHERE JobId = @JobId",
                new { JobId = jobId });
        }

        public async Task<int> GetCountByUserAsync(int userId)
        {
            using var connection = CreateConnection();
            return await connection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM Applications WHERE UserId = @UserId",
                new { UserId = userId });
        }

        public async Task<Dictionary<ApplicationStatus, int>> GetStatusStatisticsByJobAsync(int jobId)
        {
            using var connection = CreateConnection();
            var results = await connection.QueryAsync<(ApplicationStatus Status, int Count)>(
                "SELECT Status, COUNT(*) as Count FROM Applications WHERE JobId = @JobId GROUP BY Status",
                new { JobId = jobId });
            
            return results.ToDictionary(x => x.Status, x => x.Count);
        }

        public async Task<Dictionary<ApplicationStatus, int>> GetStatusStatisticsByUserAsync(int userId)
        {
            using var connection = CreateConnection();
            var results = await connection.QueryAsync<(ApplicationStatus Status, int Count)>(
                "SELECT Status, COUNT(*) as Count FROM Applications WHERE UserId = @UserId GROUP BY Status",
                new { UserId = userId });
            
            return results.ToDictionary(x => x.Status, x => x.Count);
        }
    }
}
