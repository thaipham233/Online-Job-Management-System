using AutoMapper;
using Online_Job_Management_System.DTOs.Resume;
using Online_Job_Management_System.DTOs;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Services.Resume
{
    public class ResumeService : IResumeService
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;

        public ResumeService(IResumeRepository resumeRepository, IMapper mapper)
        {
            _resumeRepository = resumeRepository;
            _mapper = mapper;
        }

        public async Task<ResumeDto?> GetByIdAsync(int id)
        {
            var resume = await _resumeRepository.GetWithDetailsAsync(id);
            return resume == null ? null : MapToDto(resume);
        }

        public async Task<PagedResult<ResumeDto>> GetByUserAsync(int userId, int pageNumber = 1, int pageSize = 10)
        {
            var resumes = await _resumeRepository.GetByUserAsync(userId);
            var resumeList = resumes.ToList();
            
            var paged = resumeList
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(MapToDto);

            return new PagedResult<ResumeDto>
            {
                Items = paged,
                TotalCount = resumeList.Count,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<ResumeDto?> GetDefaultAsync(int userId)
        {
            var resume = await _resumeRepository.GetDefaultResumeAsync(userId);
            return resume == null ? null : MapToDto(resume);
        }

        public async Task<PagedResult<ResumeDto>> GetPublicAsync(int pageNumber = 1, int pageSize = 10)
        {
            var resumes = await _resumeRepository.GetPublicResumesAsync((pageNumber - 1) * pageSize, pageSize);
            var resumeList = resumes.ToList();

            return new PagedResult<ResumeDto>
            {
                Items = resumeList.Select(MapToDto),
                TotalCount = resumeList.Count,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<ResumeDto> CreateAsync(int userId, CreateResumeDto dto)
        {
            var resume = _mapper.Map<Resume>(dto);
            resume.UserId = userId;
            resume.CreatedAt = DateTime.UtcNow;

            // If this is the first resume or explicitly set as default
            var existingResumes = await _resumeRepository.GetByUserAsync(userId);
            if (!existingResumes.Any())
            {
                resume.IsDefault = true;
            }

            await _resumeRepository.AddAsync(resume);

            // Add nested entities
            foreach (var edu in dto.Educations)
            {
                var education = _mapper.Map<Education>(edu);
                education.ResumeId = resume.Id;
                await _resumeRepository.AddEducationAsync(education);
            }

            foreach (var exp in dto.WorkExperiences)
            {
                var experience = _mapper.Map<WorkExperience>(exp);
                experience.ResumeId = resume.Id;
                await _resumeRepository.AddWorkExperienceAsync(experience);
            }

            foreach (var skill in dto.Skills)
            {
                var resumeSkill = _mapper.Map<ResumeSkill>(skill);
                resumeSkill.ResumeId = resume.Id;
                await _resumeRepository.AddResumeSkillAsync(resumeSkill);
            }

            foreach (var cert in dto.Certificates)
            {
                var certificate = _mapper.Map<Certificate>(cert);
                certificate.ResumeId = resume.Id;
                await _resumeRepository.AddCertificateAsync(certificate);
            }

            foreach (var lang in dto.Languages)
            {
                var language = _mapper.Map<Language>(lang);
                language.ResumeId = resume.Id;
                await _resumeRepository.AddLanguageAsync(language);
            }

            // Reload with details
            var fullResume = await _resumeRepository.GetWithDetailsAsync(resume.Id);
            return MapToDto(fullResume!);
        }

        public async Task<ResumeDto?> UpdateAsync(int id, int userId, UpdateResumeDto dto)
        {
            var resume = await _resumeRepository.GetByIdAsync(id);
            if (resume == null || resume.UserId != userId) return null;

            if (!string.IsNullOrEmpty(dto.Title))
                resume.Title = dto.Title;
            if (dto.Summary != null)
                resume.Summary = dto.Summary;
            if (dto.FileUrl != null)
                resume.FileUrl = dto.FileUrl;
            if (dto.CurrentPosition != null)
                resume.CurrentPosition = dto.CurrentPosition;
            if (dto.CurrentCompany != null)
                resume.CurrentCompany = dto.CurrentCompany;
            if (dto.ExpectedSalary.HasValue)
                resume.ExpectedSalary = dto.ExpectedSalary.Value;
            if (dto.PreferredLocation != null)
                resume.PreferredLocation = dto.PreferredLocation;
            if (dto.PreferredJobType.HasValue)
                resume.PreferredJobType = dto.PreferredJobType.Value;
            if (dto.IsPublic.HasValue)
                resume.IsPublic = dto.IsPublic.Value;

            resume.UpdatedAt = DateTime.UtcNow;

            await _resumeRepository.UpdateAsync(resume);

            return MapToDto(resume);
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            var resume = await _resumeRepository.GetByIdAsync(id);
            if (resume == null || resume.UserId != userId) return false;

            await _resumeRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> SetDefaultAsync(int userId, int resumeId)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId) return false;

            await _resumeRepository.SetDefaultResumeAsync(userId, resumeId);
            return true;
        }

        public async Task<EducationDto> AddEducationAsync(int resumeId, int userId, CreateEducationDto dto)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId)
                throw new UnauthorizedAccessException();

            var education = _mapper.Map<Education>(dto);
            education.ResumeId = resumeId;
            
            await _resumeRepository.AddEducationAsync(education);
            
            return _mapper.Map<EducationDto>(education);
        }

        public async Task<WorkExperienceDto> AddWorkExperienceAsync(int resumeId, int userId, CreateWorkExperienceDto dto)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId)
                throw new UnauthorizedAccessException();

            var experience = _mapper.Map<WorkExperience>(dto);
            experience.ResumeId = resumeId;
            
            await _resumeRepository.AddWorkExperienceAsync(experience);
            
            return _mapper.Map<WorkExperienceDto>(experience);
        }

        public async Task<ResumeSkillDto> AddSkillAsync(int resumeId, int userId, CreateResumeSkillDto dto)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId)
                throw new UnauthorizedAccessException();

            var skill = _mapper.Map<ResumeSkill>(dto);
            skill.ResumeId = resumeId;
            
            await _resumeRepository.AddResumeSkillAsync(skill);
            
            return _mapper.Map<ResumeSkillDto>(skill);
        }

        public async Task<CertificateDto> AddCertificateAsync(int resumeId, int userId, CreateCertificateDto dto)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId)
                throw new UnauthorizedAccessException();

            var certificate = _mapper.Map<Certificate>(dto);
            certificate.ResumeId = resumeId;
            
            await _resumeRepository.AddCertificateAsync(certificate);
            
            return _mapper.Map<CertificateDto>(certificate);
        }

        public async Task<LanguageDto> AddLanguageAsync(int resumeId, int userId, CreateLanguageDto dto)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId)
                throw new UnauthorizedAccessException();

            var language = _mapper.Map<Language>(dto);
            language.ResumeId = resumeId;
            
            await _resumeRepository.AddLanguageAsync(language);
            
            return _mapper.Map<LanguageDto>(language);
        }

        public async Task<bool> DeleteEducationAsync(int resumeId, int userId, int educationId)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId) return false;

            var education = await _resumeRepository.GetEducationByIdAsync(educationId);
            if (education == null || education.ResumeId != resumeId) return false;

            return await _resumeRepository.DeleteEducationAsync(educationId);
        }

        public async Task<bool> DeleteWorkExperienceAsync(int resumeId, int userId, int experienceId)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId) return false;

            var experience = await _resumeRepository.GetWorkExperienceByIdAsync(experienceId);
            if (experience == null || experience.ResumeId != resumeId) return false;

            return await _resumeRepository.DeleteWorkExperienceAsync(experienceId);
        }

        public async Task<bool> DeleteSkillAsync(int resumeId, int userId, int skillId)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId) return false;

            var skill = await _resumeRepository.GetResumeSkillByIdAsync(skillId);
            if (skill == null || skill.ResumeId != resumeId) return false;

            return await _resumeRepository.DeleteResumeSkillAsync(skillId);
        }

        public async Task<bool> DeleteCertificateAsync(int resumeId, int userId, int certificateId)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId) return false;

            var certificate = await _resumeRepository.GetCertificateByIdAsync(certificateId);
            if (certificate == null || certificate.ResumeId != resumeId) return false;

            return await _resumeRepository.DeleteCertificateAsync(certificateId);
        }

        public async Task<bool> DeleteLanguageAsync(int resumeId, int userId, int languageId)
        {
            var resume = await _resumeRepository.GetByIdAsync(resumeId);
            if (resume == null || resume.UserId != userId) return false;

            var language = await _resumeRepository.GetLanguageByIdAsync(languageId);
            if (language == null || language.ResumeId != resumeId) return false;

            return await _resumeRepository.DeleteLanguageAsync(languageId);
        }

        private ResumeDto MapToDto(Resume resume)
        {
            var dto = _mapper.Map<ResumeDto>(resume);
            dto.Educations = _mapper.Map<List<EducationDto>>(resume.Educations);
            dto.WorkExperiences = _mapper.Map<List<WorkExperienceDto>>(resume.WorkExperiences);
            dto.Skills = _mapper.Map<List<ResumeSkillDto>>(resume.ResumeSkills);
            dto.Certificates = _mapper.Map<List<CertificateDto>>(resume.Certificates);
            dto.Languages = _mapper.Map<List<LanguageDto>>(resume.Languages);
            return dto;
        }
    }
}
