using Online_Job_Management_System.DTOs.Admin;
using Online_Job_Management_System.DTOs;

namespace Online_Job_Management_System.Services.Admin
{
    public interface IAdminService
    {
        // Stats
        Task<AdminStatsDto> GetDashboardStatsAsync();
        Task<UserStatsDto> GetUserStatsAsync();
        Task<CompanyStatsDto> GetCompanyStatsAsync();
        Task<JobStatsDto> GetJobStatsAsync();
        Task<ApplicationStatsDto> GetApplicationStatsAsync();

        // Users
        Task<PagedResult<AdminUserListDto>> GetUsersAsync(AdminUserQueryDto query);
        Task<AdminUserDetailDto?> GetUserByIdAsync(int userId);
        Task<bool> UpdateUserStatusAsync(int userId, bool isActive);
        Task<bool> UpdateUserRolesAsync(int userId, List<string> roles);

        // Companies
        Task<PagedResult<AdminCompanyListDto>> GetCompaniesAsync(AdminCompanyQueryDto query);
        Task<AdminCompanyDetailDto?> GetCompanyByIdAsync(int companyId);
        Task<bool> VerifyCompanyAsync(int companyId, bool isVerified);

        // Jobs
        Task<PagedResult<AdminJobListDto>> GetJobsAsync(AdminJobQueryDto query);
        Task<bool> UpdateJobStatusAsync(int jobId, string status);
        Task<bool> DeleteJobAsync(int jobId);

        // Categories
        Task<PagedResult<AdminCategoryListDto>> GetCategoriesAsync(AdminCategoryQueryDto query);
        Task<AdminCategoryDetailDto?> GetCategoryByIdAsync(int categoryId);
        Task<AdminCategoryDetailDto> CreateCategoryAsync(AdminCreateCategoryDto dto);
        Task<AdminCategoryDetailDto?> UpdateCategoryAsync(int categoryId, AdminUpdateCategoryDto dto);
        Task<bool> DeleteCategoryAsync(int categoryId);

        // Applications
        Task<PagedResult<AdminApplicationListDto>> GetApplicationsAsync(AdminApplicationQueryDto query);
        Task<AdminApplicationDetailDto?> GetApplicationByIdAsync(int applicationId);
        Task<bool> UpdateApplicationStatusAsync(int applicationId, AdminUpdateApplicationStatusDto dto);
    }
}
