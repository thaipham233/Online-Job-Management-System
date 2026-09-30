using Microsoft.EntityFrameworkCore;
using Online_Job_Management_System.Data;
using Online_Job_Management_System.Models;
using System.Linq.Expressions;

namespace Online_Job_Management_System.Repositories
{
    public class JobRepository : GenericRepository<Job>, IJobRepository
    {
        public JobRepository(AppDbContext context) : base(context) { }

        public async Task<Job?> GetWithDetailsAsync(int jobId)
        {
            return await _dbSet
                .Include(j => j.Company)
                .Include(j => j.Category)
                .Include(j => j.CreatedByUser)
                .FirstOrDefaultAsync(j => j.Id == jobId);
        }

        public async Task<IEnumerable<Job>> GetByCompanyAsync(int companyId, int skip = 0, int take = 10)
        {
            return await _dbSet
                .Where(j => j.CompanyId == companyId)
                .OrderByDescending(j => j.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Job>> GetPublishedJobsAsync(int skip = 0, int take = 10)
        {
            return await _dbSet
                .Include(j => j.Company)
                .Include(j => j.Category)
                .Where(j => j.Status == JobStatus.Published && 
                           (j.ExpiredDate == null || j.ExpiredDate > DateTime.UtcNow))
                .OrderByDescending(j => j.PublishedAt ?? j.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Job>> SearchJobsAsync(
            string? keyword, 
            int? categoryId, 
            JobType? jobType, 
            ExperienceLevel? experienceLevel, 
            decimal? salaryMin, 
            string? location, 
            int skip = 0, 
            int take = 10)
        {
            var query = _dbSet
                .Include(j => j.Company)
                .Include(j => j.Category)
                .Where(j => j.Status == JobStatus.Published && 
                           (j.ExpiredDate == null || j.ExpiredDate > DateTime.UtcNow));

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var lowerKeyword = keyword.ToLower();
                query = query.Where(j => j.Title.ToLower().Contains(lowerKeyword) ||
                                        j.Description.ToLower().Contains(lowerKeyword) ||
                                        j.Requirements.ToLower().Contains(lowerKeyword) ||
                                        j.Company.Name.ToLower().Contains(lowerKeyword));
            }

            if (categoryId.HasValue)
            {
                query = query.Where(j => j.CategoryId == categoryId.Value);
            }

            if (jobType.HasValue)
            {
                query = query.Where(j => j.JobType == jobType.Value);
            }

            if (experienceLevel.HasValue)
            {
                query = query.Where(j => j.ExperienceLevel == experienceLevel.Value);
            }

            if (salaryMin.HasValue)
            {
                query = query.Where(j => j.SalaryMax >= salaryMin.Value);
            }

            if (!string.IsNullOrWhiteSpace(location))
            {
                var lowerLocation = location.ToLower();
                query = query.Where(j => j.Location != null && j.Location.ToLower().Contains(lowerLocation));
            }

            return await query
                .OrderByDescending(j => j.PublishedAt ?? j.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Job>> GetFeaturedJobsAsync(int take = 10)
        {
            return await _dbSet
                .Include(j => j.Company)
                .Include(j => j.Category)
                .Where(j => j.Status == JobStatus.Published && 
                           (j.ExpiredDate == null || j.ExpiredDate > DateTime.UtcNow))
                .OrderByDescending(j => j.ViewCount)
                .Take(take)
                .ToListAsync();
        }

        public async Task<IEnumerable<Job>> GetRecentJobsAsync(int take = 10)
        {
            return await _dbSet
                .Include(j => j.Company)
                .Include(j => j.Category)
                .Where(j => j.Status == JobStatus.Published && 
                           (j.ExpiredDate == null || j.ExpiredDate > DateTime.UtcNow))
                .OrderByDescending(j => j.PublishedAt ?? j.CreatedAt)
                .Take(take)
                .ToListAsync();
        }

        public async Task IncrementViewCountAsync(int jobId)
        {
            var job = await _dbSet.FindAsync(jobId);
            if (job != null)
            {
                job.ViewCount++;
                _dbSet.Update(job);
            }
        }

        public async Task<int> GetTotalPublishedCountAsync()
        {
            return await _dbSet
                .CountAsync(j => j.Status == JobStatus.Published && 
                                (j.ExpiredDate == null || j.ExpiredDate > DateTime.UtcNow));
        }
    }
}
