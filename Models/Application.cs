using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Online_Job_Management_System.Models
{
    public class Application
    {
        [Key]
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
        public string? Notes { get; set; } // Internal notes by employer

        // Foreign keys
        public int JobId { get; set; }

        public int UserId { get; set; }

        public int? ResumeId { get; set; }

        // Navigation properties
        [ForeignKey(nameof(JobId))]
        public virtual Job Job { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; } = null!;

        [ForeignKey(nameof(ResumeId))]
        public virtual Resume? Resume { get; set; }

        [ForeignKey(nameof(ReviewedByUserId))]
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
