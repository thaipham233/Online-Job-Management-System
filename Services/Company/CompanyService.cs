using AutoMapper;
using Online_Job_Management_System.DTOs.Company;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Services.Company
{
    public class CompanyService : ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public CompanyService(
            ICompanyRepository companyRepository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _companyRepository = companyRepository;
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<CompanyDto?> GetByIdAsync(int id)
        {
            var company = await _companyRepository.GetWithJobsAsync(id);
            if (company == null) return null;

            return MapToDto(company);
        }

        public async Task<CompanyDto?> GetByUserIdAsync(int userId)
        {
            var company = await _companyRepository.GetByUserIdAsync(userId);
            if (company == null) return null;

            return MapToDto(company);
        }

        public async Task<PagedResult<CompanyDto>> GetAllAsync(CompanySearchDto searchDto)
        {
            IEnumerable<Company> companies;

            if (!string.IsNullOrWhiteSpace(searchDto.Keyword))
            {
                companies = await _companyRepository.SearchAsync(searchDto.Keyword, 
                    (searchDto.PageNumber - 1) * searchDto.PageSize, searchDto.PageSize);
            }
            else if (searchDto.IsVerified.HasValue && searchDto.IsVerified.Value)
            {
                companies = await _companyRepository.GetVerifiedCompaniesAsync(
                    (searchDto.PageNumber - 1) * searchDto.PageSize, searchDto.PageSize);
            }
            else
            {
                companies = await _companyRepository.GetAllAsync();
                companies = companies.Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
                                    .Take(searchDto.PageSize);
            }

            var totalCount = await _companyRepository.CountAsync();
            if (!string.IsNullOrWhiteSpace(searchDto.Keyword))
            {
                totalCount = await _companyRepository.CountAsync(
                    "Name LIKE @Keyword OR Description LIKE @Keyword OR Industry LIKE @Keyword",
                    new { Keyword = $"%{searchDto.Keyword}%" });
            }
            else if (searchDto.IsVerified.HasValue)
            {
                totalCount = await _companyRepository.CountAsync(
                    "IsVerified = @IsVerified AND IsActive = 1",
                    new { IsVerified = searchDto.IsVerified.Value });
            }

            return new PagedResult<CompanyDto>
            {
                Items = companies.Select(MapToDto),
                TotalCount = totalCount,
                PageNumber = searchDto.PageNumber,
                PageSize = searchDto.PageSize
            };
        }

        public async Task<IEnumerable<CompanyDto>> GetVerifiedCompaniesAsync(int take = 10)
        {
            var companies = await _companyRepository.GetVerifiedCompaniesAsync(0, take);
            return companies.Select(MapToDto);
        }

        public async Task<CompanyDto> CreateAsync(int userId, CreateCompanyDto dto)
        {
            // Check if user already has a company
            var existingCompany = await _companyRepository.GetByUserIdAsync(userId);
            if (existingCompany != null)
            {
                throw new InvalidOperationException("User already has a company");
            }

            var company = _mapper.Map<Company>(dto);
            company.UserId = userId;
            company.CreatedAt = DateTime.UtcNow;
            company.IsActive = true;
            company.IsVerified = false;

            await _companyRepository.AddAsync(company);

            return MapToDto(company);
        }

        public async Task<CompanyDto?> UpdateAsync(int id, UpdateCompanyDto dto)
        {
            var company = await _companyRepository.GetByIdAsync(id);
            if (company == null) return null;

            if (!string.IsNullOrEmpty(dto.Name))
                company.Name = dto.Name;
            if (dto.Description != null)
                company.Description = dto.Description;
            if (dto.Website != null)
                company.Website = dto.Website;
            if (dto.Location != null)
                company.Location = dto.Location;
            if (dto.LogoUrl != null)
                company.LogoUrl = dto.LogoUrl;
            if (dto.CoverImageUrl != null)
                company.CoverImageUrl = dto.CoverImageUrl;
            if (dto.Size.HasValue)
                company.Size = dto.Size.Value;
            if (dto.Industry != null)
                company.Industry = dto.Industry;
            if (dto.IsActive.HasValue)
                company.IsActive = dto.IsActive.Value;

            company.UpdatedAt = DateTime.UtcNow;

            await _companyRepository.UpdateAsync(company);

            return MapToDto(company);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);
            if (company == null) return false;

            await _companyRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> VerifyCompanyAsync(int id)
        {
            var company = await _companyRepository.GetByIdAsync(id);
            if (company == null) return false;

            company.IsVerified = true;
            company.UpdatedAt = DateTime.UtcNow;

            await _companyRepository.UpdateAsync(company);
            return true;
        }

        private CompanyDto MapToDto(Company company)
        {
            var dto = _mapper.Map<CompanyDto>(company);
            dto.JobsCount = company.Jobs?.Count ?? 0;
            return dto;
        }
    }
}
