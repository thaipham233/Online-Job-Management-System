using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.Models
{
    [Table("Applications")]
    public class Application
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

        [MaxLength(1000)]
        public string? CoverLetter { get; set; }

        public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public DateTime? ReviewedAt { get; set; }

        public int? ReviewedByUserId { get; set; }

        [MaxLength(1000)]
        public string? RejectionReason { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        public int JobId { get; set; }

        public int UserId { get; set; }

        public int? ResumeId { get; set; }

        [Computed]
        public virtual Job Job { get; set; } = null!;

        [Computed]
        public virtual User User { get; set; } = null!;

        [Computed]
        public virtual Resume? Resume { get; set; }

        [Computed]
        public virtual User? ReviewedByUser { get; set; }
    }

    public enum ApplicationStatus
    {
        Pending = 1,
        UnderReview = 2,
        Shortlisted = 3,
        InterviewScheduled = 4,
        Interviewed = 5,
        Offered = 6,
        Accepted = 7,
        Rejected = 8,
        Withdrawn = 9
    }
}
