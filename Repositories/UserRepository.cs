using Microsoft.EntityFrameworkCore;
using Online_Job_Management_System.Data;
using Online_Job_Management_System.Models;
using System.Linq.Expressions;

namespace Online_Job_Management_System.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByUserNameAsync(string userName)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.UserName == userName);
        }

        public async Task<User?> GetWithCompanyAsync(int userId)
        {
            return await _dbSet
                .Include(u => u.Company)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User?> GetWithResumesAsync(int userId)
        {
            return await _dbSet
                .Include(u => u.Resumes)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User?> GetWithApplicationsAsync(int userId)
        {
            return await _dbSet
                .Include(u => u.Applications)
                .ThenInclude(a => a.Job)
                .ThenInclude(j => j.Company)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<bool> IsEmailUniqueAsync(string email, int? excludeUserId = null)
        {
            var query = _dbSet.Where(u => u.Email == email);
            if (excludeUserId.HasValue)
                query = query.Where(u => u.Id != excludeUserId.Value);
            return !await query.AnyAsync();
        }

        public async Task<bool> IsUserNameUniqueAsync(string userName, int? excludeUserId = null)
        {
            var query = _dbSet.Where(u => u.UserName == userName);
            if (excludeUserId.HasValue)
                query = query.Where(u => u.Id != excludeUserId.Value);
            return !await query.AnyAsync();
        }
    }
}
