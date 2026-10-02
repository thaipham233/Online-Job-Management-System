using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.Models
{
    [Table("Jobs")]
    public class Job
    {
        [Dapper.Contrib.Extensions.ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Requirements { get; set; } = string.Empty;

        [Required]
        public string Benefits { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Location { get; set; }

        public JobType JobType { get; set; } = JobType.FullTime;

        public ExperienceLevel ExperienceLevel { get; set; } = ExperienceLevel.Fresher;

        public decimal? SalaryMin { get; set; }

        public decimal? SalaryMax { get; set; }

        public SalaryType SalaryType { get; set; } = SalaryType.Monthly;

        public bool IsNegotiableSalary { get; set; } = false;

        [MaxLength(200)]
        public string? Skills { get; set; }

        public int Quantity { get; set; } = 1;

        public DateTime? ExpiredDate { get; set; }

        public JobStatus Status { get; set; } = JobStatus.Draft;

        public int ViewCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? PublishedAt { get; set; }

        public int CompanyId { get; set; }

        public int CategoryId { get; set; }

        public int? CreatedByUserId { get; set; }

        [Computed]
        public virtual Company Company { get; set; } = null!;

        [Computed]
        public virtual Category Category { get; set; } = null!;

        [Computed]
        public virtual User? CreatedByUser { get; set; }

        [Computed]
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    }

    public enum JobType
    {
        FullTime = 1,
        PartTime = 2,
        Contract = 3,
        Internship = 4,
        Remote = 5,
        Freelance = 6
    }

    public enum ExperienceLevel
    {
        Fresher = 1,
        Junior = 2,
        Mid = 3,
        Senior = 4,
        Lead = 5,
        Manager = 6,
        Director = 7
    }

    public enum SalaryType
    {
        Hourly = 1,
        Daily = 2,
        Weekly = 3,
        Monthly = 4,
        Yearly = 5,
        Project = 6
    }

    public enum JobStatus
    {
        Draft = 1,
        PendingApproval = 2,
        Published = 3,
        Closed = 4,
        Expired = 5,
        Rejected = 6
    }
}
