using Online_Job_Management_System.DTOs.Company;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Services.Company
{
    public interface ICompanyService
    {
        Task<CompanyDto?> GetByIdAsync(int id);
        Task<CompanyDto?> GetByUserIdAsync(int userId);
        Task<PagedResult<CompanyDto>> GetAllAsync(CompanySearchDto searchDto);
        Task<IEnumerable<CompanyDto>> GetVerifiedCompaniesAsync(int take = 10);
        Task<CompanyDto> CreateAsync(int userId, CreateCompanyDto dto);
        Task<CompanyDto?> UpdateAsync(int id, UpdateCompanyDto dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> VerifyCompanyAsync(int id);
    }
}
