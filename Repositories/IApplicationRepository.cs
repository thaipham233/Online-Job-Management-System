using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public interface IApplicationRepository : IGenericRepository<Application>
    {
        Task<Application?> GetWithDetailsAsync(int applicationId);
        Task<IEnumerable<Application>> GetByJobAsync(int jobId, int skip = 0, int take = 10);
        Task<IEnumerable<Application>> GetByUserAsync(int userId, int skip = 0, int take = 10);
        Task<IEnumerable<Application>> GetByCompanyAsync(int companyId, int skip = 0, int take = 10);
        Task<IEnumerable<Application>> GetByStatusAsync(ApplicationStatus status, int skip = 0, int take = 10);
        Task<Application?> GetUserApplicationForJobAsync(int userId, int jobId);
        Task<int> GetCountByJobAsync(int jobId);
        Task<int> GetCountByUserAsync(int userId);
        Task<Dictionary<ApplicationStatus, int>> GetStatusStatisticsByJobAsync(int jobId);
        Task<Dictionary<ApplicationStatus, int>> GetStatusStatisticsByUserAsync(int userId);
    }
}
