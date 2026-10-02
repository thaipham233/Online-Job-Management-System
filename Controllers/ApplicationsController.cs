using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Online_Job_Management_System.DTOs.Application;
using Online_Job_Management_System.Services.Application;
using Online_Job_Management_System.Services.Company;
using Online_Job_Management_System.Services.Job;

namespace Online_Job_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationService _applicationService;
        private readonly ICompanyService _companyService;
        private readonly IJobService _jobService;

        public ApplicationsController(
            IApplicationService applicationService,
            ICompanyService companyService,
            IJobService jobService)
        {
            _applicationService = applicationService;
            _companyService = companyService;
            _jobService = jobService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var application = await _applicationService.GetByIdAsync(id);
            if (application == null) return NotFound();

            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isApplicant = application.UserId == userId;
            var isEmployer = User.IsInRole("Employer") || User.IsInRole("Admin");
            var isAdmin = User.IsInRole("Admin");

            // Check authorization - only applicant, employer of the job, or admin can view
            if (!isApplicant && !isAdmin)
            {
                if (isEmployer)
                {
                    var company = await _companyService.GetByUserIdAsync(userId);
                    if (company == null || application.Job?.CompanyId != company.Id)
                        return Forbid();
                }
                else
                {
                    return Forbid();
                }
            }

            return Ok(application);
        }

        [HttpGet("my-applications")]
        [Authorize]
        public async Task<IActionResult> GetMyApplications([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _applicationService.GetByUserAsync(userId, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("job/{jobId}")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> GetByJob(int jobId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (User.IsInRole("Employer"))
            {
                var company = await _companyService.GetByUserIdAsync(userId);
                if (company == null) return Forbid();

                var job = await _jobService.GetByIdAsync(jobId);
                if (job == null || job.CompanyId != company.Id) return NotFound();
            }

            var result = await _applicationService.GetByJobAsync(jobId, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("company")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetByCompany([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var company = await _companyService.GetByUserIdAsync(userId);
            if (company == null) return NotFound();

            var result = await _applicationService.GetByCompanyAsync(company.Id, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("search")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> Search([FromQuery] ApplicationSearchDto searchDto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (User.IsInRole("Employer"))
            {
                var company = await _companyService.GetByUserIdAsync(userId);
                if (company == null) return Forbid();
                searchDto.CompanyId = company.Id;
            }

            var result = await _applicationService.SearchAsync(searchDto);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Create([FromBody] CreateApplicationDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var application = await _applicationService.CreateAsync(userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = application.Id }, application);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateApplicationStatusDto dto)
        {
            var reviewerId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (User.IsInRole("Employer"))
            {
                var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                var company = await _companyService.GetByUserIdAsync(userId);
                if (company == null) return Forbid();

                var existingApplication = await _applicationService.GetByIdAsync(id);
                if (existingApplication == null || existingApplication.Job?.CompanyId != company.Id) return NotFound();
            }

            var application = await _applicationService.UpdateStatusAsync(id, dto, reviewerId);
            if (application == null) return NotFound();
            return Ok(application);
        }

        [HttpPost("{id}/withdraw")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Withdraw(int id)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var result = await _applicationService.WithdrawAsync(id, userId);
                if (!result) return NotFound();
                return Ok(new { message = "Application withdrawn successfully" });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("job/{jobId}/statistics")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> GetJobStatistics(int jobId)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (User.IsInRole("Employer"))
            {
                var company = await _companyService.GetByUserIdAsync(userId);
                if (company == null) return Forbid();

                var job = await _jobService.GetByIdAsync(jobId);
                if (job == null || job.CompanyId != company.Id) return NotFound();
            }

            var stats = await _applicationService.GetStatisticsByJobAsync(jobId);
            return Ok(stats);
        }

        [HttpGet("my-statistics")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> GetMyStatistics()
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var stats = await _applicationService.GetStatisticsByUserAsync(userId);
            return Ok(stats);
        }
    }
}
