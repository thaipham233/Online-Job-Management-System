using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(IConfiguration configuration) : base(configuration) { }

        public async Task<Company?> GetByUserIdAsync(int userId)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Company>(
                "SELECT * FROM Companies WHERE UserId = @UserId", new { UserId = userId });
        }

        public async Task<Company?> GetWithJobsAsync(int companyId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT c.*, j.* 
                FROM Companies c
                LEFT JOIN Jobs j ON j.CompanyId = c.Id
                WHERE c.Id = @CompanyId";
            
            var companyDict = new Dictionary<int, Company>();
            await connection.QueryAsync<Company, Job, Company>(sql,
                (c, j) =>
                {
                    if (!companyDict.TryGetValue(c.Id, out var company))
                    {
                        company = c;
                        company.Jobs = new List<Job>();
                        companyDict.Add(c.Id, company);
                    }
                    if (j != null && j.Id > 0)
                        company.Jobs.Add(j);
                    return company;
                },
                new { CompanyId = companyId },
                splitOn: "Id");
            
            return companyDict.Values.FirstOrDefault();
        }

        public async Task<IEnumerable<Company>> GetVerifiedCompaniesAsync(int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<Company>(
                "SELECT * FROM Companies WHERE IsVerified = 1 AND IsActive = 1 ORDER BY CreatedAt DESC OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY",
                new { Skip = skip, Take = take });
        }

        public async Task<IEnumerable<Company>> SearchAsync(string keyword, int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT * FROM Companies 
                WHERE IsActive = 1 
                AND (Name LIKE @Keyword OR Description LIKE @Keyword OR Industry LIKE @Keyword)
                ORDER BY CreatedAt DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            var param = new { Keyword = $"%{keyword}%", Skip = skip, Take = take };
            return await connection.QueryAsync<Company>(sql, param);
        }
    }
}
