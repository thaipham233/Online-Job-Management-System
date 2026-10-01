using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public interface IResumeRepository : IGenericRepository<Resume>
    {
        Task<Resume?> GetWithDetailsAsync(int resumeId);
        Task<IEnumerable<Resume>> GetByUserAsync(int userId);
        Task<Resume?> GetDefaultResumeAsync(int userId);
        Task SetDefaultResumeAsync(int userId, int resumeId);
        Task<IEnumerable<Resume>> GetPublicResumesAsync(int skip = 0, int take = 10);
    }
}
