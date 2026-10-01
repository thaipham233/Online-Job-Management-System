using Online_Job_Management_System.DTOs.Application;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Services.Application
{
    public interface IApplicationService
    {
        Task<ApplicationDto?> GetByIdAsync(int id);
        Task<PagedResult<ApplicationDto>> GetByJobAsync(int jobId, int pageNumber = 1, int pageSize = 10);
        Task<PagedResult<ApplicationDto>> GetByUserAsync(int userId, int pageNumber = 1, int pageSize = 10);
        Task<PagedResult<ApplicationDto>> GetByCompanyAsync(int companyId, int pageNumber = 1, int pageSize = 10);
        Task<PagedResult<ApplicationDto>> SearchAsync(ApplicationSearchDto searchDto);
        Task<ApplicationDto> CreateAsync(int userId, CreateApplicationDto dto);
        Task<ApplicationDto?> UpdateStatusAsync(int id, UpdateApplicationStatusDto dto, int reviewerId);
        Task<bool> WithdrawAsync(int id, int userId);
        Task<bool> HasUserAppliedAsync(int userId, int jobId);
        Task<ApplicationStatisticsDto> GetStatisticsByJobAsync(int jobId);
        Task<ApplicationStatisticsDto> GetStatisticsByUserAsync(int userId);
    }
}
