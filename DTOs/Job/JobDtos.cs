using System.ComponentModel.DataAnnotations;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.DTOs.Company;
using Online_Job_Management_System.DTOs.Category;

namespace Online_Job_Management_System.DTOs.Job
{
    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? ShortDescription { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Benefits { get; set; } = string.Empty;
        public string? Location { get; set; }
        public JobType JobType { get; set; }
        public string JobTypeName { get; set; } = string.Empty;
        public ExperienceLevel ExperienceLevel { get; set; }
        public string ExperienceLevelName { get; set; } = string.Empty;
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public SalaryType SalaryType { get; set; }
        public string SalaryTypeName { get; set; } = string.Empty;
        public bool IsNegotiableSalary { get; set; }
        public string? Skills { get; set; }
        public int Quantity { get; set; }
        public DateTime? ExpiredDate { get; set; }
        public JobStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public int CompanyId { get; set; }
        public CompanyDto? Company { get; set; }
        public int CategoryId { get; set; }
        public CategoryDto? Category { get; set; }
        public int? CreatedByUserId { get; set; }
        public int ApplicationsCount { get; set; }
    }

    public class CreateJobDto
    {
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

        [Required]
        public JobType JobType { get; set; } = JobType.FullTime;

        [Required]
        public ExperienceLevel ExperienceLevel { get; set; } = ExperienceLevel.Fresher;

        public decimal? SalaryMin { get; set; }

        public decimal? SalaryMax { get; set; }

        public SalaryType SalaryType { get; set; } = SalaryType.Monthly;

        public bool IsNegotiableSalary { get; set; } = false;

        [MaxLength(200)]
        public string? Skills { get; set; }

        public int Quantity { get; set; } = 1;

        public DateTime? ExpiredDate { get; set; }

        [Required]
        public int CategoryId { get; set; }
    }

    public class UpdateJobDto
    {
        [MaxLength(200)]
        public string? Title { get; set; }

        [MaxLength(500)]
        public string? ShortDescription { get; set; }

        public string? Description { get; set; }

        public string? Requirements { get; set; }

        public string? Benefits { get; set; }

        [MaxLength(100)]
        public string? Location { get; set; }

        public JobType? JobType { get; set; }

        public ExperienceLevel? ExperienceLevel { get; set; }

        public decimal? SalaryMin { get; set; }

        public decimal? SalaryMax { get; set; }

        public SalaryType? SalaryType { get; set; }

        public bool? IsNegotiableSalary { get; set; }

        [MaxLength(200)]
        public string? Skills { get; set; }

        public int? Quantity { get; set; }

        public DateTime? ExpiredDate { get; set; }

        public int? CategoryId { get; set; }

        public JobStatus? Status { get; set; }
    }

    public class JobSearchDto
    {
        public string? Keyword { get; set; }
        public int? CategoryId { get; set; }
        public JobType? JobType { get; set; }
        public ExperienceLevel? ExperienceLevel { get; set; }
        public decimal? SalaryMin { get; set; }
        public string? Location { get; set; }
        public JobStatus? Status { get; set; }
        public int? CompanyId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "CreatedAt";
        public string? SortDirection { get; set; } = "desc";
    }

    public class JobStatusUpdateDto
    {
        [Required]
        public JobStatus Status { get; set; }
    }
}
