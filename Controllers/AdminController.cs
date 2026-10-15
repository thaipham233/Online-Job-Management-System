using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Online_Job_Management_System.DTOs.Admin;
using Online_Job_Management_System.Services.Admin;

namespace Online_Job_Management_System.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        // ==================== STATS ====================

        [HttpGet("stats/dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _adminService.GetDashboardStatsAsync();
            return Ok(stats);
        }

        [HttpGet("stats/users")]
        public async Task<IActionResult> GetUserStats()
        {
            var stats = await _adminService.GetUserStatsAsync();
            return Ok(stats);
        }

        [HttpGet("stats/companies")]
        public async Task<IActionResult> GetCompanyStats()
        {
            var stats = await _adminService.GetCompanyStatsAsync();
            return Ok(stats);
        }

        [HttpGet("stats/jobs")]
        public async Task<IActionResult> GetJobStats()
        {
            var stats = await _adminService.GetJobStatsAsync();
            return Ok(stats);
        }

        [HttpGet("stats/applications")]
        public async Task<IActionResult> GetApplicationStats()
        {
            var stats = await _adminService.GetApplicationStatsAsync();
            return Ok(stats);
        }

        // ==================== USERS ====================

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] AdminUserQueryDto query)
        {
            var result = await _adminService.GetUsersAsync(query);
            return Ok(result);
        }

        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _adminService.GetUserByIdAsync(userId);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("users/{userId}/status")]
        public async Task<IActionResult> UpdateUserStatus(int userId, [FromBody] UpdateUserStatusDto dto)
        {
            var result = await _adminService.UpdateUserStatusAsync(userId, dto.IsActive);
            if (!result) return NotFound();
            return Ok(new { message = $"User {(dto.IsActive ? "activated" : "deactivated")} successfully" });
        }

        [HttpPut("users/{userId}/roles")]
        public async Task<IActionResult> UpdateUserRoles(int userId, [FromBody] UpdateUserRolesDto dto)
        {
            var result = await _adminService.UpdateUserRolesAsync(userId, dto.Roles);
            if (!result) return NotFound();
            return Ok(new { message = "User roles updated successfully" });
        }

        // ==================== COMPANIES ====================

        [HttpGet("companies")]
        public async Task<IActionResult> GetCompanies([FromQuery] AdminCompanyQueryDto query)
        {
            var result = await _adminService.GetCompaniesAsync(query);
            return Ok(result);
        }

        [HttpGet("companies/{companyId}")]
        public async Task<IActionResult> GetCompanyById(int companyId)
        {
            var company = await _adminService.GetCompanyByIdAsync(companyId);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpPut("companies/{companyId}/verify")]
        public async Task<IActionResult> VerifyCompany(int companyId, [FromBody] VerifyCompanyDto dto)
        {
            var result = await _adminService.VerifyCompanyAsync(companyId, dto.IsVerified);
            if (!result) return NotFound();
            return Ok(new { message = $"Company {(dto.IsVerified ? "verified" : "unverified")} successfully" });
        }

        // ==================== JOBS ====================

        [HttpGet("jobs")]
        public async Task<IActionResult> GetJobs([FromQuery] AdminJobQueryDto query)
        {
            var result = await _adminService.GetJobsAsync(query);
            return Ok(result);
        }

        [HttpPut("jobs/{jobId}/status")]
        public async Task<IActionResult> UpdateJobStatus(int jobId, [FromBody] UpdateJobStatusDto dto)
        {
            var result = await _adminService.UpdateJobStatusAsync(jobId, dto.Status);
            if (!result) return NotFound();
            return Ok(new { message = $"Job status updated to {dto.Status}" });
        }

        [HttpDelete("jobs/{jobId}")]
        public async Task<IActionResult> DeleteJob(int jobId)
        {
            var result = await _adminService.DeleteJobAsync(jobId);
            if (!result) return NotFound();
            return NoContent();
        }

        // ==================== CATEGORIES ====================

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories([FromQuery] AdminCategoryQueryDto query)
        {
            var result = await _adminService.GetCategoriesAsync(query);
            return Ok(result);
        }

        [HttpGet("categories/{categoryId}")]
        public async Task<IActionResult> GetCategoryById(int categoryId)
        {
            var category = await _adminService.GetCategoryByIdAsync(categoryId);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            var category = await _adminService.CreateCategoryAsync(dto);
            return CreatedAtAction(nameof(GetCategoryById), new { categoryId = category.Id }, category);
        }

        [HttpPut("categories/{categoryId}")]
        public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] UpdateCategoryDto dto)
        {
            var category = await _adminService.UpdateCategoryAsync(categoryId, dto);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpDelete("categories/{categoryId}")]
        public async Task<IActionResult> DeleteCategory(int categoryId)
        {
            var result = await _adminService.DeleteCategoryAsync(categoryId);
            if (!result) return NotFound();
            return NoContent();
        }

        // ==================== APPLICATIONS ====================

        [HttpGet("applications")]
        public async Task<IActionResult> GetApplications([FromQuery] AdminApplicationQueryDto query)
        {
            var result = await _adminService.GetApplicationsAsync(query);
            return Ok(result);
        }

        [HttpGet("applications/{applicationId}")]
        public async Task<IActionResult> GetApplicationById(int applicationId)
        {
            var application = await _adminService.GetApplicationByIdAsync(applicationId);
            if (application == null) return NotFound();
            return Ok(application);
        }

        [HttpPut("applications/{applicationId}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(int applicationId, [FromBody] UpdateApplicationStatusDto dto)
        {
            var result = await _adminService.UpdateApplicationStatusAsync(applicationId, dto);
            if (!result) return NotFound();
            return Ok(new { message = $"Application status updated to {dto.Status}" });
        }
    }
}
