using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public interface ICompanyRepository : IGenericRepository<Company>
    {
        Task<Company?> GetByUserIdAsync(int userId);
        Task<Company?> GetWithJobsAsync(int companyId);
        Task<IEnumerable<Company>> GetVerifiedCompaniesAsync(int skip = 0, int take = 10);
        Task<IEnumerable<Company>> SearchAsync(string keyword, int skip = 0, int take = 10);
    }
}
