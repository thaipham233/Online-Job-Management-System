using Online_Job_Management_System.DTOs.Job;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Services.Job
{
    public interface IJobService
    {
        Task<JobDto?> GetByIdAsync(int id);
        Task<PagedResult<JobDto>> GetPublishedJobsAsync(JobSearchDto searchDto);
        Task<PagedResult<JobDto>> GetByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 10);
        Task<IEnumerable<JobDto>> GetFeaturedJobsAsync(int take = 10);
        Task<IEnumerable<JobDto>> GetRecentJobsAsync(int take = 10);
        Task<JobDto> CreateAsync(int userId, CreateJobDto dto);
        Task<JobDto?> UpdateAsync(int id, UpdateJobDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ChangeStatusAsync(int id, JobStatusUpdateDto dto);
        Task IncrementViewCountAsync(int id);
        Task<JobStatisticsDto> GetStatisticsAsync(int? companyId = null);
    }

    public class JobStatisticsDto
    {
        public int TotalJobs { get; set; }
        public int PublishedJobs { get; set; }
        public int DraftJobs { get; set; }
        public int ClosedJobs { get; set; }
        public Dictionary<JobType, int> ByJobType { get; set; } = new();
        public Dictionary<ExperienceLevel, int> ByExperienceLevel { get; set; } = new();
        public Dictionary<string, int> ByCategory { get; set; } = new();
        public Dictionary<string, int> ByMonth { get; set; } = new();
    }
}
