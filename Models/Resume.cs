using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Online_Job_Management_System.Models
{
    public class Resume
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Summary { get; set; }

        [MaxLength(500)]
        public string? FileUrl { get; set; } // Path to uploaded CV file

        public string? ParsedContent { get; set; } // JSON parsed from CV

        [MaxLength(100)]
        public string? CurrentPosition { get; set; }

        [MaxLength(200)]
        public string? CurrentCompany { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ExpectedSalary { get; set; }

        [MaxLength(100)]
        public string? PreferredLocation { get; set; }

        public JobType? PreferredJobType { get; set; }

        public bool IsDefault { get; set; } = false;

        public bool IsPublic { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Foreign key
        public int UserId { get; set; }

        // Navigation properties
        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; } = null!;

        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();

        // Education
        public virtual ICollection<Education> Educations { get; set; } = new List<Education>();

        // Experience
        public virtual ICollection<WorkExperience> WorkExperiences { get; set; } = new List<WorkExperience>();

        // Skills
        public virtual ICollection<ResumeSkill> ResumeSkills { get; set; } = new List<ResumeSkill>();

        // Certificates
        public virtual ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();

        // Languages
        public virtual ICollection<Language> Languages { get; set; } = new List<Language>();
    }

    public class Education
    {
        [Key]
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

        [Column(TypeName = "decimal(3,2)")]
        public decimal? GPA { get; set; }

        // Foreign key
        public int ResumeId { get; set; }

        [ForeignKey(nameof(ResumeId))]
        public virtual Resume Resume { get; set; } = null!;
    }

    public class WorkExperience
    {
        [Key]
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

        // Foreign key
        public int ResumeId { get; set; }

        [ForeignKey(nameof(ResumeId))]
        public virtual Resume Resume { get; set; } = null!;
    }

    public class ResumeSkill
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string SkillName { get; set; } = string.Empty;

        public SkillLevel Level { get; set; } = SkillLevel.Beginner;

        public int YearsOfExperience { get; set; } = 0;

        // Foreign key
        public int ResumeId { get; set; }

        [ForeignKey(nameof(ResumeId))]
        public virtual Resume Resume { get; set; } = null!;
    }

    public class Certificate
    {
        [Key]
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

        // Foreign key
        public int ResumeId { get; set; }

        [ForeignKey(nameof(ResumeId))]
        public virtual Resume Resume { get; set; } = null!;
    }

    public class Language
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public LanguageProficiency Proficiency { get; set; } = LanguageProficiency.Basic;

        // Foreign key
        public int ResumeId { get; set; }

        [ForeignKey(nameof(ResumeId))]
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
