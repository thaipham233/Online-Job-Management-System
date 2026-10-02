using System.ComponentModel.DataAnnotations;
using Online_Job_Management_System.DTOs.Job;
using Online_Job_Management_System.DTOs.Resume;
using Online_Job_Management_System.DTOs.Auth;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.DTOs.Application
{
    public class ApplicationDto
    {
        public int Id { get; set; }
        public string? CoverLetter { get; set; }
        public ApplicationStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? RejectionReason { get; set; }
        public string? Notes { get; set; }
        public int JobId { get; set; }
        public JobDto? Job { get; set; }
        public int UserId { get; set; }
        public UserDto? User { get; set; }
        public int? ResumeId { get; set; }
        public ResumeDto? Resume { get; set; }
        public int? ReviewedByUserId { get; set; }
    }

    public class CreateApplicationDto
    {
        [MaxLength(1000)]
        public string? CoverLetter { get; set; }

        [Required]
        public int JobId { get; set; }

        public int? ResumeId { get; set; }
    }

    public class UpdateApplicationStatusDto
    {
        [Required]
        public ApplicationStatus Status { get; set; }

        [MaxLength(1000)]
        public string? RejectionReason { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }

    public class ApplicationSearchDto
    {
        public int? JobId { get; set; }
        public int? UserId { get; set; }
        public int? CompanyId { get; set; }
        public ApplicationStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

    public class ApplicationStatisticsDto
    {
        public int TotalApplications { get; set; }
        public Dictionary<ApplicationStatus, int> ByStatus { get; set; } = new();
        public Dictionary<string, int> ByJob { get; set; } = new();
        public Dictionary<string, int> ByMonth { get; set; } = new();
    }
}
