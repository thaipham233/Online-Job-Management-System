namespace Online_Job_Management_System.DTOs.Admin
{
    public class AdminApplicationListDto
    {
        public int Id { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime AppliedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? CoverLetter { get; set; }
        public string? ResumeUrl { get; set; }
    }

    public class AdminApplicationDetailDto : AdminApplicationListDto
    {
        public int JobId { get; set; }
        public int CandidateId { get; set; }
        public string? CandidatePhone { get; set; }
        public string? CandidateAddress { get; set; }
        public string? ExpectedSalary { get; set; }
        public string? Note { get; set; }
        public string? RejectionReason { get; set; }
    }

    public class AdminApplicationQueryDto : PagedRequest
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
        public int? JobId { get; set; }
        public int? CompanyId { get; set; }
    }

    public class UpdateApplicationStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? RejectionReason { get; set; }
        public string? Note { get; set; }
    }
}
