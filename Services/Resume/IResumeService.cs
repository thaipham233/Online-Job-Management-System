using Online_Job_Management_System.DTOs.Resume;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Services.Resume
{
    public interface IResumeService
    {
        Task<ResumeDto?> GetByIdAsync(int id);
        Task<PagedResult<ResumeDto>> GetByUserAsync(int userId, int pageNumber = 1, int pageSize = 10);
        Task<ResumeDto?> GetDefaultAsync(int userId);
        Task<PagedResult<ResumeDto>> GetPublicAsync(int pageNumber = 1, int pageSize = 10);
        Task<ResumeDto> CreateAsync(int userId, CreateResumeDto dto);
        Task<ResumeDto?> UpdateAsync(int id, int userId, UpdateResumeDto dto);
        Task<bool> DeleteAsync(int id, int userId);
        Task<bool> SetDefaultAsync(int userId, int resumeId);
        Task<EducationDto> AddEducationAsync(int resumeId, int userId, CreateEducationDto dto);
        Task<WorkExperienceDto> AddWorkExperienceAsync(int resumeId, int userId, CreateWorkExperienceDto dto);
        Task<ResumeSkillDto> AddSkillAsync(int resumeId, int userId, CreateResumeSkillDto dto);
        Task<CertificateDto> AddCertificateAsync(int resumeId, int userId, CreateCertificateDto dto);
        Task<LanguageDto> AddLanguageAsync(int resumeId, int userId, CreateLanguageDto dto);
        Task<bool> DeleteEducationAsync(int resumeId, int userId, int educationId);
        Task<bool> DeleteWorkExperienceAsync(int resumeId, int userId, int experienceId);
        Task<bool> DeleteSkillAsync(int resumeId, int userId, int skillId);
        Task<bool> DeleteCertificateAsync(int resumeId, int userId, int certificateId);
        Task<bool> DeleteLanguageAsync(int resumeId, int userId, int languageId);
    }
}
