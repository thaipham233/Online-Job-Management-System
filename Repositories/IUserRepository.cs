using Online_Job_Management_System.Models;
using System.Linq.Expressions;

namespace Online_Job_Management_System.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByUserNameAsync(string userName);
        Task<User?> GetWithCompanyAsync(int userId);
        Task<User?> GetWithResumesAsync(int userId);
        Task<User?> GetWithApplicationsAsync(int userId);
        Task<bool> IsEmailUniqueAsync(string email, int? excludeUserId = null);
        Task<bool> IsUserNameUniqueAsync(string userName, int? excludeUserId = null);
    }
}
