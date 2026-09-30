using Microsoft.EntityFrameworkCore;
using Online_Job_Management_System.Data;
using Online_Job_Management_System.Models;
using System.Linq.Expressions;

namespace Online_Job_Management_System.Repositories
{
    public class ApplicationRepository : GenericRepository<Application>, IApplicationRepository
    {
        public ApplicationRepository(AppDbContext context) : base(context) { }

        public async Task<Application?> GetWithDetailsAsync(int applicationId)
        {
            return await _dbSet
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.User)
                .Include(a => a.Resume)
                .Include(a => a.ReviewedByUser)
                .FirstOrDefaultAsync(a => a.Id == applicationId);
        }

        public async Task<IEnumerable<Application>> GetByJobAsync(int jobId, int skip = 0, int take = 10)
        {
            return await _dbSet
                .Include(a => a.User)
                .Include(a => a.Resume)
                .Where(a => a.JobId == jobId)
                .OrderByDescending(a => a.AppliedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Application>> GetByUserAsync(int userId, int skip = 0, int take = 10)
        {
            return await _dbSet
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.Job.Category)
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.AppliedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Application>> GetByCompanyAsync(int companyId, int skip = 0, int take = 10)
        {
            return await _dbSet
                .Include(a => a.Job)
                .Include(a => a.User)
                .Include(a => a.Resume)
                .Where(a => a.Job.CompanyId == companyId)
                .OrderByDescending(a => a.AppliedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Application>> GetByStatusAsync(ApplicationStatus status, int skip = 0, int take = 10)
        {
            return await _dbSet
                .Include(a => a.Job)
                    .ThenInclude(j => j.Company)
                .Include(a => a.User)
                .Where(a => a.Status == status)
                .OrderByDescending(a => a.AppliedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<Application?> GetUserApplicationForJobAsync(int userId, int jobId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(a => a.UserId == userId && a.JobId == jobId);
        }

        public async Task<int> GetCountByJobAsync(int jobId)
        {
            return await _dbSet.CountAsync(a => a.JobId == jobId);
        }

        public async Task<int> GetCountByUserAsync(int userId)
        {
            return await _dbSet.CountAsync(a => a.UserId == userId);
        }

        public async Task<Dictionary<ApplicationStatus, int>> GetStatusStatisticsByJobAsync(int jobId)
        {
            return await _dbSet
                .Where(a => a.JobId == jobId)
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Status, x => x.Count);
        }

        public async Task<Dictionary<ApplicationStatus, int>> GetStatusStatisticsByUserAsync(int userId)
        {
            return await _dbSet
                .Where(a => a.UserId == userId)
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Status, x => x.Count);
        }
    }
}
