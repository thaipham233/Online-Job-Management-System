using AutoMapper;
using Online_Job_Management_System.DTOs.Application;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Services.Application
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IJobRepository _jobRepository;
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;

        public ApplicationService(
            IApplicationRepository applicationRepository,
            IJobRepository jobRepository,
            IResumeRepository resumeRepository,
            IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _jobRepository = jobRepository;
            _resumeRepository = resumeRepository;
            _mapper = mapper;
        }

        public async Task<ApplicationDto?> GetByIdAsync(int id)
        {
            var application = await _applicationRepository.GetWithDetailsAsync(id);
            if (application == null) return null;

            return MapToDto(application);
        }

        public async Task<PagedResult<ApplicationDto>> GetByJobAsync(int jobId, int pageNumber = 1, int pageSize = 10)
        {
            var applications = await _applicationRepository.GetByJobAsync(jobId, (pageNumber - 1) * pageSize, pageSize);
            var totalCount = await _applicationRepository.GetCountByJobAsync(jobId);

            return new PagedResult<ApplicationDto>
            {
                Items = applications.Select(MapToDto),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<ApplicationDto>> GetByUserAsync(int userId, int pageNumber = 1, int pageSize = 10)
        {
            var applications = await _applicationRepository.GetByUserAsync(userId, (pageNumber - 1) * pageSize, pageSize);
            var totalCount = await _applicationRepository.GetCountByUserAsync(userId);

            return new PagedResult<ApplicationDto>
            {
                Items = applications.Select(MapToDto),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<ApplicationDto>> GetByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 10)
        {
            var applications = await _applicationRepository.GetByCompanyAsync(companyId, (pageNumber - 1) * pageSize, pageSize);
            // For total count, we'd need a specific repo method, using a reasonable approach
            var totalCount = applications.Count();

            return new PagedResult<ApplicationDto>
            {
                Items = applications.Select(MapToDto),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PagedResult<ApplicationDto>> SearchAsync(ApplicationSearchDto searchDto)
        {
            IEnumerable<Application> applications;
            int totalCount;

            var whereClause = new List<string>();
            var parameters = new DynamicParameters();

            if (searchDto.JobId.HasValue)
            {
                whereClause.Add("JobId = @JobId");
                parameters.Add("JobId", searchDto.JobId.Value);
            }

            if (searchDto.UserId.HasValue)
            {
                whereClause.Add("UserId = @UserId");
                parameters.Add("UserId", searchDto.UserId.Value);
            }

            if (searchDto.Status.HasValue)
            {
                whereClause.Add("Status = @Status");
                parameters.Add("Status", (int)searchDto.Status.Value);
            }

            if (searchDto.FromDate.HasValue)
            {
                whereClause.Add("AppliedAt >= @FromDate");
                parameters.Add("FromDate", searchDto.FromDate.Value);
            }

            if (searchDto.ToDate.HasValue)
            {
                whereClause.Add("AppliedAt <= @ToDate");
                parameters.Add("ToDate", searchDto.ToDate.Value);
            }

            var where = whereClause.Any() ? string.Join(" AND ", whereClause) : "1=1";
            
            applications = await _applicationRepository.FindAsync(
                where + $" ORDER BY AppliedAt DESC OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY",
                new { Skip = (searchDto.PageNumber - 1) * searchDto.PageSize, Take = searchDto.PageSize });

            totalCount = await _applicationRepository.CountAsync(where, parameters);

            return new PagedResult<ApplicationDto>
            {
                Items = applications.Select(MapToDto),
                TotalCount = totalCount,
                PageNumber = searchDto.PageNumber,
                PageSize = searchDto.PageSize
            };
        }

        public async Task<ApplicationDto> CreateAsync(int userId, CreateApplicationDto dto)
        {
            // Check if job exists and is published
            var job = await _jobRepository.GetByIdAsync(dto.JobId);
            if (job == null)
            {
                throw new ArgumentException("Job not found");
            }

            if (job.Status != JobStatus.Published)
            {
                throw new InvalidOperationException("Cannot apply to unpublished job");
            }

            // Check if user already applied
            var hasApplied = await _applicationRepository.GetUserApplicationForJobAsync(userId, dto.JobId);
            if (hasApplied != null)
            {
                throw new InvalidOperationException("Already applied to this job");
            }

            // Verify resume belongs to user if provided
            if (dto.ResumeId.HasValue)
            {
                var resume = await _resumeRepository.GetByIdAsync(dto.ResumeId.Value);
                if (resume == null || resume.UserId != userId)
                {
                    throw new ArgumentException("Invalid resume");
                }
            }

            var application = _mapper.Map<Application>(dto);
            application.UserId = userId;
            application.AppliedAt = DateTime.UtcNow;
            application.Status = ApplicationStatus.Pending;

            await _applicationRepository.AddAsync(application);

            return MapToDto(application);
        }

        public async Task<ApplicationDto?> UpdateStatusAsync(int id, UpdateApplicationStatusDto dto, int reviewerId)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            if (application == null) return null;

            application.Status = dto.Status;
            application.ReviewedAt = DateTime.UtcNow;
            application.ReviewedByUserId = reviewerId;
            application.RejectionReason = dto.RejectionReason;
            application.Notes = dto.Notes;

            await _applicationRepository.UpdateAsync(application);

            return MapToDto(application);
        }

        public async Task<bool> WithdrawAsync(int id, int userId)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            if (application == null || application.UserId != userId) return false;

            if (application.Status == ApplicationStatus.Accepted || 
                application.Status == ApplicationStatus.Offered)
            {
                throw new InvalidOperationException("Cannot withdraw accepted application");
            }

            application.Status = ApplicationStatus.Withdrawn;
            application.UpdatedAt = DateTime.UtcNow;

            await _applicationRepository.UpdateAsync(application);
            return true;
        }

        public async Task<bool> HasUserAppliedAsync(int userId, int jobId)
        {
            var application = await _applicationRepository.GetUserApplicationForJobAsync(userId, jobId);
            return application != null;
        }

        public async Task<ApplicationStatisticsDto> GetStatisticsByJobAsync(int jobId)
        {
            var stats = await _applicationRepository.GetStatusStatisticsByJobAsync(jobId);
            var totalCount = await _applicationRepository.GetCountByJobAsync(jobId);

            return new ApplicationStatisticsDto
            {
                TotalApplications = totalCount,
                ByStatus = stats
            };
        }

        public async Task<ApplicationStatisticsDto> GetStatisticsByUserAsync(int userId)
        {
            var stats = await _applicationRepository.GetStatusStatisticsByUserAsync(userId);
            var totalCount = await _applicationRepository.GetCountByUserAsync(userId);

            return new ApplicationStatisticsDto
            {
                TotalApplications = totalCount,
                ByStatus = stats
            };
        }

        private ApplicationDto MapToDto(Application application)
        {
            var dto = _mapper.Map<ApplicationDto>(application);
            dto.StatusName = application.Status.ToString();
            return dto;
        }
    }
}
