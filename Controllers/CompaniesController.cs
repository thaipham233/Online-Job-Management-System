using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Online_Job_Management_System.DTOs.Company;
using Online_Job_Management_System.Services.Company;

namespace Online_Job_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var company = await _companyService.GetByIdAsync(id);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpGet("my-company")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> GetMyCompany()
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var company = await _companyService.GetByUserIdAsync(userId);
            if (company == null) return NotFound();
            return Ok(company);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CompanySearchDto searchDto)
        {
            var result = await _companyService.GetAllAsync(searchDto);
            return Ok(result);
        }

        [HttpGet("verified")]
        public async Task<IActionResult> GetVerified([FromQuery] int take = 10)
        {
            var companies = await _companyService.GetVerifiedCompaniesAsync(take);
            return Ok(companies);
        }

        [HttpPost]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            try
            {
                var company = await _companyService.CreateAsync(userId, dto);
                return CreatedAtAction(nameof(GetById), new { id = company.Id }, company);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Employer")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCompanyDto dto)
        {
            var userId = int.Parse(User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
            var company = await _companyService.GetByUserIdAsync(userId);
            if (company == null || company.Id != id)
                return Forbid();

            var updated = await _companyService.UpdateAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Employer,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _companyService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpPost("{id}/verify")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Verify(int id)
        {
            var result = await _companyService.VerifyCompanyAsync(id);
            if (!result) return NotFound();
            return Ok(new { message = "Company verified successfully" });
        }
    }
}
