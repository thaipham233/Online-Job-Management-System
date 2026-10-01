using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Online_Job_Management_System.DTOs.Resume;
using Online_Job_Management_System.Services.Resume;

namespace Online_Job_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResumesController : ControllerBase
    {
        private readonly IResumeService _resumeService;

        public ResumesController(IResumeService resumeService)
        {
            _resumeService = resumeService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var resume = await _resumeService.GetByIdAsync(id);
            if (resume == null) return NotFound();

            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var isOwner = resume.UserId == userId;
            var isPublic = resume.IsPublic;
            var isEmployer = User.IsInRole("Employer") || User.IsInRole("Admin");

            if (!isOwner && !isPublic && !isEmployer)
                return Forbid();

            return Ok(resume);
        }

        [HttpGet("my-resumes")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> GetMyResumes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.GetByUserAsync(userId, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("default")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> GetDefault()
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var resume = await _resumeService.GetDefaultAsync(userId);
            if (resume == null) return NotFound();
            return Ok(resume);
        }

        [HttpGet("public")]
        public async Task<IActionResult> GetPublic([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _resumeService.GetPublicAsync(pageNumber, pageSize);
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Create([FromBody] CreateResumeDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var resume = await _resumeService.CreateAsync(userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = resume.Id }, resume);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateResumeDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var resume = await _resumeService.UpdateAsync(id, userId, dto);
            if (resume == null) return NotFound();
            return Ok(resume);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.DeleteAsync(id, userId);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/set-default")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> SetDefault(int id)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.SetDefaultAsync(userId, id);
            if (!result) return NotFound();
            return Ok(new { message = "Default resume set successfully" });
        }

        // Education endpoints
        [HttpPost("{resumeId}/educations")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> AddEducation(int resumeId, [FromBody] CreateEducationDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var education = await _resumeService.AddEducationAsync(resumeId, userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = resumeId }, education);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{resumeId}/educations/{educationId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> DeleteEducation(int resumeId, int educationId)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.DeleteEducationAsync(resumeId, userId, educationId);
            if (!result) return NotFound();
            return NoContent();
        }

        // WorkExperience endpoints
        [HttpPost("{resumeId}/work-experiences")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> AddWorkExperience(int resumeId, [FromBody] CreateWorkExperienceDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var experience = await _resumeService.AddWorkExperienceAsync(resumeId, userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = resumeId }, experience);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{resumeId}/work-experiences/{experienceId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> DeleteWorkExperience(int resumeId, int experienceId)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.DeleteWorkExperienceAsync(resumeId, userId, experienceId);
            if (!result) return NotFound();
            return NoContent();
        }

        // Skill endpoints
        [HttpPost("{resumeId}/skills")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> AddSkill(int resumeId, [FromBody] CreateResumeSkillDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var skill = await _resumeService.AddSkillAsync(resumeId, userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = resumeId }, skill);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{resumeId}/skills/{skillId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> DeleteSkill(int resumeId, int skillId)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.DeleteSkillAsync(resumeId, userId, skillId);
            if (!result) return NotFound();
            return NoContent();
        }

        // Certificate endpoints
        [HttpPost("{resumeId}/certificates")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> AddCertificate(int resumeId, [FromBody] CreateCertificateDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var certificate = await _resumeService.AddCertificateAsync(resumeId, userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = resumeId }, certificate);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{resumeId}/certificates/{certificateId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> DeleteCertificate(int resumeId, int certificateId)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.DeleteCertificateAsync(resumeId, userId, certificateId);
            if (!result) return NotFound();
            return NoContent();
        }

        // Language endpoints
        [HttpPost("{resumeId}/languages")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> AddLanguage(int resumeId, [FromBody] CreateLanguageDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var language = await _resumeService.AddLanguageAsync(resumeId, userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = resumeId }, language);
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        [HttpDelete("{resumeId}/languages/{languageId}")]
        [Authorize(Roles = "Candidate")]
        public async Task<IActionResult> DeleteLanguage(int resumeId, int languageId)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = await _resumeService.DeleteLanguageAsync(resumeId, userId, languageId);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
