using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Online_Job_Management_System.DTOs.Job;
using Online_Job_Management_System.Services.Job;
using Online_Job_Management_System.Services.Company;

namespace Online_Job_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;
        private readonly ICompanyService _companyService;

        public JobsController(IJobService jobService, ICompanyService companyService)
        {
            _jobService = jobService;
            _companyService = companyService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var job = await _jobService.GetByIdAsync(id);
            if (job == null) return NotFound();
            
            // Increment view count for public access
            if (job.Status == Online_Job_Management_System.Models.JobStatus.Published)
            {
                await _jobService.IncrementViewCountAsync(id);
            }
            
            return Ok(job);
        }

        [HttpGet]
        public async Task<IActionResult> GetPublished([FromQuery] JobSearchDto searchDto)
        {
            var result = await _jobService.GetPublishedJobsAsync(searchDto);
            return Ok(result);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeatured([FromQuery] int take = 10)
        {
            var jobs = await _jobService.GetFeaturedJobsAsync(take);
            return Ok(jobs);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int take = 10)
        {
            var jobs = await _jobService.GetRecentJobsAsync(take);
            return Ok(jobs);
        }

        [HttpGet("my-jobs")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetMyJobs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var company = await _companyService.GetByUserIdAsync(userId);
            if (company == null) return NotFound(new { message = "Company not found" });

            var result = await _jobService.GetByCompanyAsync(company.Id, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("statistics")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> GetStatistics()
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            int? companyId = null;

            if (User.IsInRole("Employer"))
            {
                var company = await _companyService.GetByUserIdAsync(userId);
                if (company == null) return NotFound(new { message = "Company not found" });
                companyId = company.Id;
            }

            var stats = await _jobService.GetStatisticsAsync(companyId);
            return Ok(stats);
        }

        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Create([FromBody] CreateJobDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var job = await _jobService.CreateAsync(userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = job.Id }, job);
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

        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateJobDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var company = await _companyService.GetByUserIdAsync(userId);
            if (company == null) return Forbid();

            // Verify job belongs to this company
            var job = await _jobService.GetByIdAsync(id);
            if (job == null || job.CompanyId != company.Id) return NotFound();

            var updated = await _jobService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (User.IsInRole("Employer"))
            {
                var company = await _companyService.GetByUserIdAsync(userId);
                if (company == null) return Forbid();

                var job = await _jobService.GetByIdAsync(id);
                if (job == null || job.CompanyId != company.Id) return NotFound();
            }

            var result = await _jobService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPatch("{id}/status")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> ChangeStatus(int id, [FromBody] JobStatusUpdateDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            if (User.IsInRole("Employer"))
            {
                var company = await _companyService.GetByUserIdAsync(userId);
                if (company == null) return Forbid();

                var job = await _jobService.GetByIdAsync(id);
                if (job == null || job.CompanyId != company.Id) return NotFound();
            }

            var result = await _jobService.ChangeStatusAsync(id, dto);
            if (!result) return NotFound();
            return Ok(new { message = "Status updated successfully" });
        }
    }
}
