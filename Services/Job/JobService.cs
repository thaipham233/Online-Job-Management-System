using AutoMapper;
using Online_Job_Management_System.DTOs.Job;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Services.Job
{
    public class JobService : IJobService
    {
        private readonly IJobRepository _jobRepository;
        private readonly ICompanyRepository _companyRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public JobService(
            IJobRepository jobRepository,
            ICompanyRepository companyRepository,
            ICategoryRepository categoryRepository,
            IMapper mapper)
        {
            _jobRepository = jobRepository;
            _companyRepository = companyRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<JobDto?> GetByIdAsync(int id)
        {
            var job = await _jobRepository.GetWithDetailsAsync(id);
            if (job == null) return null;

            return MapToDto(job);
        }

        public async Task<PagedResult<JobDto>> GetPublishedJobsAsync(JobSearchDto searchDto)
        {
            IEnumerable<Online_Job_Management_System.Models.Job> jobs;
            int totalCount;

            if (searchDto.Status.HasValue)
            {
                // Admin viewing all jobs with specific status
                jobs = await _jobRepository.FindAsync(
                    "Status = @Status",
                    new { Status = (int)searchDto.Status.Value });
                jobs = jobs.Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
                          .Take(searchDto.PageSize);
                totalCount = await _jobRepository.CountAsync(
                    "Status = @Status", new { Status = (int)searchDto.Status.Value });
            }
            else
            {
                // Public search
                jobs = await _jobRepository.SearchJobsAsync(
                    searchDto.Keyword,
                    searchDto.CategoryId,
                    searchDto.JobType,
                    searchDto.ExperienceLevel,
                    searchDto.SalaryMin,
                    searchDto.Location,
                    (searchDto.PageNumber - 1) * searchDto.PageSize,
                    searchDto.PageSize);
                
                totalCount = await _jobRepository.GetTotalPublishedCountAsync();
            }

            return new PagedResult<JobDto>
            {
                Items = jobs.Select(MapToDto),
                TotalCount = totalCount,
                PageNumber = searchDto.PageNumber,
                PageSize = searchDto.PageSize
            };
        }

        public async Task<PagedResult<JobDto>> GetByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 10)
        {
            var jobs = await _jobRepository.GetByCompanyAsync(companyId, (pageNumber - 1) * pageSize, pageSize);
            var totalCount = await _jobRepository.CountAsync("CompanyId = @CompanyId", new { CompanyId = companyId });

            return new PagedResult<JobDto>
            {
                Items = jobs.Select(MapToDto),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<IEnumerable<JobDto>> GetFeaturedJobsAsync(int take = 10)
        {
            var jobs = await _jobRepository.GetFeaturedJobsAsync(take);
            return jobs.Select(MapToDto);
        }

        public async Task<IEnumerable<JobDto>> GetRecentJobsAsync(int take = 10)
        {
            var jobs = await _jobRepository.GetRecentJobsAsync(take);
            return jobs.Select(MapToDto);
        }

        public async Task<JobDto> CreateAsync(int userId, CreateJobDto dto)
        {
            // Verify user has a company
            var company = await _companyRepository.GetByUserIdAsync(userId);
            if (company == null)
            {
                throw new InvalidOperationException("User must have a company to create jobs");
            }

            // Verify category exists
            var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
            if (category == null)
            {
                throw new ArgumentException("Invalid category");
            }

            var job = _mapper.Map<Online_Job_Management_System.Models.Job>(dto);
            job.CompanyId = company.Id;
            job.CreatedByUserId = userId;
            job.CreatedAt = DateTime.UtcNow;
            job.Status = JobStatus.Draft;
            job.ViewCount = 0;

            await _jobRepository.AddAsync(job);

            return MapToDto(job);
        }

        public async Task<JobDto?> UpdateAsync(int id, UpdateJobDto dto)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null) return null;

            if (!string.IsNullOrEmpty(dto.Title))
                job.Title = dto.Title;
            if (dto.ShortDescription != null)
                job.ShortDescription = dto.ShortDescription;
            if (dto.Description != null)
                job.Description = dto.Description;
            if (dto.Requirements != null)
                job.Requirements = dto.Requirements;
            if (dto.Benefits != null)
                job.Benefits = dto.Benefits;
            if (dto.Location != null)
                job.Location = dto.Location;
            if (dto.JobType.HasValue)
                job.JobType = dto.JobType.Value;
            if (dto.ExperienceLevel.HasValue)
                job.ExperienceLevel = dto.ExperienceLevel.Value;
            if (dto.SalaryMin.HasValue)
                job.SalaryMin = dto.SalaryMin.Value;
            if (dto.SalaryMax.HasValue)
                job.SalaryMax = dto.SalaryMax.Value;
            if (dto.SalaryType.HasValue)
                job.SalaryType = dto.SalaryType.Value;
            if (dto.IsNegotiableSalary.HasValue)
                job.IsNegotiableSalary = dto.IsNegotiableSalary.Value;
            if (dto.Skills != null)
                job.Skills = dto.Skills;
            if (dto.Quantity.HasValue)
                job.Quantity = dto.Quantity.Value;
            if (dto.ExpiredDate.HasValue)
                job.ExpiredDate = dto.ExpiredDate.Value;
            if (dto.CategoryId.HasValue)
            {
                var category = await _categoryRepository.GetByIdAsync(dto.CategoryId.Value);
                if (category == null)
                    throw new ArgumentException("Invalid category");
                job.CategoryId = dto.CategoryId.Value;
            }

            job.UpdatedAt = DateTime.UtcNow;

            await _jobRepository.UpdateAsync(job);

            return MapToDto(job);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null) return false;

            await _jobRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> ChangeStatusAsync(int id, JobStatusUpdateDto dto)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null) return false;

            job.Status = dto.Status;
            if (dto.Status == JobStatus.Published && job.PublishedAt == null)
            {
                job.PublishedAt = DateTime.UtcNow;
            }
            job.UpdatedAt = DateTime.UtcNow;

            await _jobRepository.UpdateAsync(job);
            return true;
        }

        public async Task IncrementViewCountAsync(int id)
        {
            await _jobRepository.IncrementViewCountAsync(id);
        }

        public async Task<JobStatisticsDto> GetStatisticsAsync(int? companyId = null)
        {
            // This would need additional repository methods for full stats
            // For now return basic structure
            return new JobStatisticsDto
            {
                TotalJobs = companyId.HasValue 
                    ? await _jobRepository.CountAsync("CompanyId = @CompanyId", new { CompanyId = companyId })
                    : await _jobRepository.GetTotalPublishedCountAsync(),
                PublishedJobs = await _jobRepository.CountAsync("Status = @Status", new { Status = (int)JobStatus.Published }),
                DraftJobs = await _jobRepository.CountAsync("Status = @Status", new { Status = (int)JobStatus.Draft }),
                ClosedJobs = await _jobRepository.CountAsync("Status = @Status", new { Status = (int)JobStatus.Closed })
            };
        }

        private JobDto MapToDto(Online_Job_Management_System.Models.Job job)
        {
            var dto = _mapper.Map<JobDto>(job);
            dto.JobTypeName = job.JobType.ToString();
            dto.ExperienceLevelName = job.ExperienceLevel.ToString();
            dto.SalaryTypeName = job.SalaryType.ToString();
            dto.StatusName = job.Status.ToString();
            dto.ApplicationsCount = job.Applications?.Count ?? 0;
            return dto;
        }
    }
}
