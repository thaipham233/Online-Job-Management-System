using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.DTOs.Resume
{
    public class ResumeDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Summary { get; set; }
        public string? FileUrl { get; set; }
        public string? CurrentPosition { get; set; }
        public string? CurrentCompany { get; set; }
        public decimal? ExpectedSalary { get; set; }
        public string? PreferredLocation { get; set; }
        public JobType? PreferredJobType { get; set; }
        public bool IsDefault { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int UserId { get; set; }
        public UserDto? User { get; set; }
        public List<EducationDto> Educations { get; set; } = new();
        public List<WorkExperienceDto> WorkExperiences { get; set; } = new();
        public List<ResumeSkillDto> Skills { get; set; } = new();
        public List<CertificateDto> Certificates { get; set; } = new();
        public List<LanguageDto> Languages { get; set; } = new();
    }

    public class CreateResumeDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Summary { get; set; }

        [MaxLength(500)]
        public string? FileUrl { get; set; }

        [MaxLength(100)]
        public string? CurrentPosition { get; set; }

        [MaxLength(200)]
        public string? CurrentCompany { get; set; }

        public decimal? ExpectedSalary { get; set; }

        [MaxLength(100)]
        public string? PreferredLocation { get; set; }

        public JobType? PreferredJobType { get; set; }

        public bool IsPublic { get; set; } = false;

        public List<CreateEducationDto> Educations { get; set; } = new();
        public List<CreateWorkExperienceDto> WorkExperiences { get; set; } = new();
        public List<CreateResumeSkillDto> Skills { get; set; } = new();
        public List<CreateCertificateDto> Certificates { get; set; } = new();
        public List<CreateLanguageDto> Languages { get; set; } = new();
    }

    public class UpdateResumeDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(1000)]
        public string? Summary { get; set; }

        [MaxLength(500)]
        public string? FileUrl { get; set; }

        [MaxLength(100)]
        public string? CurrentPosition { get; set; }

        [MaxLength(200)]
        public string? CurrentCompany { get; set; }

        public decimal? ExpectedSalary { get; set; }

        [MaxLength(100)]
        public string? PreferredLocation { get; set; }

        public JobType? PreferredJobType { get; set; }

        public bool? IsPublic { get; set; }
    }

    public class EducationDto
    {
        public int Id { get; set; }
        public string Institution { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string? FieldOfStudy { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrentlyStudying { get; set; }
        public string? Description { get; set; }
        public decimal? GPA { get; set; }
        public int ResumeId { get; set; }
    }

    public class CreateEducationDto
    {
        [Required]
        [MaxLength(200)]
        public string Institution { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Degree { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? FieldOfStudy { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCurrentlyStudying { get; set; } = false;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public decimal? GPA { get; set; }
    }

    public class WorkExperienceDto
    {
        public int Id { get; set; }
        public string Company { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrentJob { get; set; }
        public string? Description { get; set; }
        public int ResumeId { get; set; }
    }

    public class CreateWorkExperienceDto
    {
        [Required]
        [MaxLength(200)]
        public string Company { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Position { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Location { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCurrentJob { get; set; } = false;

        [MaxLength(2000)]
        public string? Description { get; set; }
    }

    public class ResumeSkillDto
    {
        public int Id { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public SkillLevel Level { get; set; }
        public string LevelName { get; set; } = string.Empty;
        public int YearsOfExperience { get; set; }
        public int ResumeId { get; set; }
    }

    public class CreateResumeSkillDto
    {
        [Required]
        [MaxLength(100)]
        public string SkillName { get; set; } = string.Empty;

        public SkillLevel Level { get; set; } = SkillLevel.Beginner;

        public int YearsOfExperience { get; set; } = 0;
    }

    public class CertificateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? IssuingOrganization { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? CredentialId { get; set; }
        public string? CredentialUrl { get; set; }
        public int ResumeId { get; set; }
    }

    public class CreateCertificateDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? IssuingOrganization { get; set; }

        public DateTime? IssueDate { get; set; }

        public DateTime? ExpiryDate { get; set; }

        [MaxLength(500)]
        public string? CredentialId { get; set; }

        [MaxLength(500)]
        public string? CredentialUrl { get; set; }
    }

    public class LanguageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public LanguageProficiency Proficiency { get; set; }
        public string ProficiencyName { get; set; } = string.Empty;
        public int ResumeId { get; set; }
    }

    public class CreateLanguageDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public LanguageProficiency Proficiency { get; set; } = LanguageProficiency.Basic;
    }
}
