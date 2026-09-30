using Online_Job_Management_System.Models;
using System.Linq.Expressions;

namespace Online_Job_Management_System.Repositories
{
    public interface IJobRepository : IGenericRepository<Job>
    {
        Task<Job?> GetWithDetailsAsync(int jobId);
        Task<IEnumerable<Job>> GetByCompanyAsync(int companyId, int skip = 0, int take = 10);
        Task<IEnumerable<Job>> GetPublishedJobsAsync(int skip = 0, int take = 10);
        Task<IEnumerable<Job>> SearchJobsAsync(string? keyword, int? categoryId, JobType? jobType, ExperienceLevel? experienceLevel, decimal? salaryMin, string? location, int skip = 0, int take = 10);
        Task<IEnumerable<Job>> GetFeaturedJobsAsync(int take = 10);
        Task<IEnumerable<Job>> GetRecentJobsAsync(int take = 10);
        Task IncrementViewCountAsync(int jobId);
        Task<int> GetTotalPublishedCountAsync();
    }
}
