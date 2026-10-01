using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public interface IResumeRepository : IGenericRepository<Resume>
    {
        Task<Resume?> GetWithDetailsAsync(int resumeId);
        Task<IEnumerable<Resume>> GetByUserAsync(int userId);
        Task<Resume?> GetDefaultResumeAsync(int userId);
        Task SetDefaultResumeAsync(int userId, int resumeId);
        Task<IEnumerable<Resume>> GetPublicResumesAsync(int skip = 0, int take = 10);

        // Education
        Task<Education?> GetEducationByIdAsync(int id);
        Task<IEnumerable<Education>> GetEducationsByResumeAsync(int resumeId);
        Task<int> AddEducationAsync(Education education);
        Task<bool> UpdateEducationAsync(Education education);
        Task<bool> DeleteEducationAsync(int id);

        // WorkExperience
        Task<WorkExperience?> GetWorkExperienceByIdAsync(int id);
        Task<IEnumerable<WorkExperience>> GetWorkExperiencesByResumeAsync(int resumeId);
        Task<int> AddWorkExperienceAsync(WorkExperience workExperience);
        Task<bool> UpdateWorkExperienceAsync(WorkExperience workExperience);
        Task<bool> DeleteWorkExperienceAsync(int id);

        // ResumeSkill
        Task<ResumeSkill?> GetResumeSkillByIdAsync(int id);
        Task<IEnumerable<ResumeSkill>> GetResumeSkillsByResumeAsync(int resumeId);
        Task<int> AddResumeSkillAsync(ResumeSkill resumeSkill);
        Task<bool> UpdateResumeSkillAsync(ResumeSkill resumeSkill);
        Task<bool> DeleteResumeSkillAsync(int id);

        // Certificate
        Task<Certificate?> GetCertificateByIdAsync(int id);
        Task<IEnumerable<Certificate>> GetCertificatesByResumeAsync(int resumeId);
        Task<int> AddCertificateAsync(Certificate certificate);
        Task<bool> UpdateCertificateAsync(Certificate certificate);
        Task<bool> DeleteCertificateAsync(int id);

        // Language
        Task<Language?> GetLanguageByIdAsync(int id);
        Task<IEnumerable<Language>> GetLanguagesByResumeAsync(int resumeId);
        Task<int> AddLanguageAsync(Language language);
        Task<bool> UpdateLanguageAsync(Language language);
        Task<bool> DeleteLanguageAsync(int id);
    }
}
