using Microsoft.EntityFrameworkCore;
using Online_Job_Management_System.Data;
using Online_Job_Management_System.Models;
using System.Linq.Expressions;

namespace Online_Job_Management_System.Repositories
{
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context) { }

        public async Task<Company?> GetByUserIdAsync(int userId)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.UserId == userId);
        }

        public async Task<Company?> GetWithJobsAsync(int companyId)
        {
            return await _dbSet
                .Include(c => c.Jobs)
                .FirstOrDefaultAsync(c => c.Id == companyId);
        }

        public async Task<IEnumerable<Company>> GetVerifiedCompaniesAsync(int skip = 0, int take = 10)
        {
            return await _dbSet
                .Where(c => c.IsVerified && c.IsActive)
                .OrderByDescending(c => c.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Company>> SearchAsync(string keyword, int skip = 0, int take = 10)
        {
            var lowerKeyword = keyword.ToLower();
            return await _dbSet
                .Where(c => c.IsActive && 
                    (c.Name.ToLower().Contains(lowerKeyword) || 
                     c.Description!.ToLower().Contains(lowerKeyword) ||
                     c.Industry!.ToLower().Contains(lowerKeyword)))
                .OrderByDescending(c => c.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
    }
}
