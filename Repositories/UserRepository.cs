using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(string connectionString) : base(connectionString) { }

        public async Task<User?> GetByEmailAsync(string email)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE Email = @Email", new { Email = email });
        }

        public async Task<User?> GetByUserNameAsync(string userName)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM Users WHERE UserName = @UserName", new { UserName = userName });
        }

        public async Task<User?> GetWithCompanyAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT u.*, c.* 
                FROM Users u
                LEFT JOIN Companies c ON c.UserId = u.Id
                WHERE u.Id = @UserId";
            
            User? user = null;
            await connection.QueryAsync<User, Company, User>(sql,
                (u, c) =>
                {
                    user = u;
                    if (c != null && c.Id > 0)
                        user.Company = c;
                    return user;
                },
                new { UserId = userId },
                splitOn: "Id");
            
            return user;
        }

        public async Task<User?> GetWithResumesAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT u.*, r.* 
                FROM Users u
                LEFT JOIN Resumes r ON r.UserId = u.Id
                WHERE u.Id = @UserId";
            
            var userDict = new Dictionary<int, User>();
            await connection.QueryAsync<User, Resume, User>(sql,
                (u, r) =>
                {
                    if (!userDict.TryGetValue(u.Id, out var user))
                    {
                        user = u;
                        user.Resumes = new List<Resume>();
                        userDict.Add(u.Id, user);
                    }
                    if (r != null && r.Id > 0)
                        user.Resumes.Add(r);
                    return user;
                },
                new { UserId = userId },
                splitOn: "Id");
            
            return userDict.Values.FirstOrDefault();
        }

        public async Task<User?> GetWithApplicationsAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT u.*, a.*, j.*, c.*, cat.*
                FROM Users u
                LEFT JOIN Applications a ON a.UserId = u.Id
                LEFT JOIN Jobs j ON j.Id = a.JobId
                LEFT JOIN Companies c ON c.Id = j.CompanyId
                LEFT JOIN Categories cat ON cat.Id = j.CategoryId
                WHERE u.Id = @UserId";
            
            var userDict = new Dictionary<int, User>();
            await connection.QueryAsync<User, Application, Job, Company, Category, User>(sql,
                (u, a, j, c, cat) =>
                {
                    if (!userDict.TryGetValue(u.Id, out var user))
                    {
                        user = u;
                        user.Applications = new List<Application>();
                        userDict.Add(u.Id, user);
                    }
                    if (a != null && a.Id > 0)
                    {
                        if (j != null && j.Id > 0)
                        {
                            j.Company = c;
                            j.Category = cat;
                            a.Job = j;
                        }
                        user.Applications.Add(a);
                    }
                    return user;
                },
                new { UserId = userId },
                splitOn: "Id,Id,Id,Id");
            
            return userDict.Values.FirstOrDefault();
        }

        public async Task<bool> IsEmailUniqueAsync(string email, int? excludeUserId = null)
        {
            using var connection = CreateConnection();
            var sql = excludeUserId.HasValue
                ? "SELECT COUNT(*) FROM Users WHERE Email = @Email AND Id != @ExcludeId"
                : "SELECT COUNT(*) FROM Users WHERE Email = @Email";
            
            var count = await connection.ExecuteScalarAsync<int>(sql, 
                new { Email = email, ExcludeId = excludeUserId });
            return count == 0;
        }

        public async Task<bool> IsUserNameUniqueAsync(string userName, int? excludeUserId = null)
        {
            using var connection = CreateConnection();
            var sql = excludeUserId.HasValue
                ? "SELECT COUNT(*) FROM Users WHERE UserName = @UserName AND Id != @ExcludeId"
                : "SELECT COUNT(*) FROM Users WHERE UserName = @UserName";
            
            var count = await connection.ExecuteScalarAsync<int>(sql,
                new { UserName = userName, ExcludeId = excludeUserId });
            return count == 0;
        }
    }
}
