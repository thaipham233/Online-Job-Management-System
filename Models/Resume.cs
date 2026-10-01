using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.Models
{
    [Table("Resumes")]
    public class Resume
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Summary { get; set; }

        [MaxLength(500)]
        public string? FileUrl { get; set; }

        public string? ParsedContent { get; set; }

        [MaxLength(100)]
        public string? CurrentPosition { get; set; }

        [MaxLength(200)]
        public string? CurrentCompany { get; set; }

        public decimal? ExpectedSalary { get; set; }

        [MaxLength(100)]
        public string? PreferredLocation { get; set; }

        public JobType? PreferredJobType { get; set; }

        public bool IsDefault { get; set; } = false;

        public bool IsPublic { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public int UserId { get; set; }

        [Computed]
        public virtual User User { get; set; } = null!;

        [Computed]
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();

        [Computed]
        public virtual ICollection<Education> Educations { get; set; } = new List<Education>();

        [Computed]
        public virtual ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();

        [Computed]
        public virtual ICollection<ResumeSkill> ResumeSkills { get; set; } = new List<ResumeSkill>();

        [Computed]
        public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

        [Computed]
        public virtual ICollection<Language> Languages { get; set; } = new List<Language>();
    }

    [Table("Educations")]
    public class Education
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

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

        public int ResumeId { get; set; }

        [Computed]
        public virtual Resume Resume { get; set; } = null!;
    }

    [Table("WorkExperiences")]
    public class WorkExperience
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Company { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Position { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Location { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCurrentJob { get; set; } = false;

        [MaxLength(2000)]
        public string? Description { get; set; }

        public int ResumeId { get; set; }

        [Computed]
        public virtual Resume Resume { get; set; } = null!;
    }

    [Table("ResumeSkills")]
    public class ResumeSkill
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string SkillName { get; set; } = string.Empty;

        public SkillLevel Level { get; set; } = SkillLevel.Beginner;

        public int YearsOfExperience { get; set; } = 0;

        public int ResumeId { get; set; }

        [Computed]
        public virtual Resume Resume { get; set; } = null!;
    }

    [Table("Certificates")]
    public class Certificate
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

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

        public int ResumeId { get; set; }

        [Computed]
        public virtual Resume Resume { get; set; } = null!;
    }

    [Table("Languages")]
    public class Language
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public LanguageProficiency Proficiency { get; set; } = LanguageProficiency.Basic;

        public int ResumeId { get; set; }

        [Computed]
        public virtual Resume Resume { get; set; } = null!;
    }

    public enum SkillLevel
    {
        Beginner = 1,
        Intermediate = 2,
        Advanced = 3,
        Expert = 4
    }

    public enum LanguageProficiency
    {
        Basic = 1,
        Conversational = 2,
        Professional = 3,
        Native = 4
    }
}
