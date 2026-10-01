using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.DTOs.Company
{
    public class CompanyDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Website { get; set; }
        public string? Location { get; set; }
        public string? LogoUrl { get; set; }
        public string? CoverImageUrl { get; set; }
        public int? Size { get; set; }
        public string? Industry { get; set; }
        public bool IsVerified { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public UserDto? User { get; set; }
        public int JobsCount { get; set; }
    }

    public class CreateCompanyDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        [Url]
        public string? Website { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(500)]
        public string? CoverImageUrl { get; set; }

        public int? Size { get; set; }

        [MaxLength(100)]
        public string? Industry { get; set; }
    }

    public class UpdateCompanyDto
    {
        [MaxLength(200)]
        public string? Name { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
        [Url]
        public string? Website { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(500)]
        public string? CoverImageUrl { get; set; }

        public int? Size { get; set; }

        [MaxLength(100)]
        public string? Industry { get; set; }

        public bool? IsActive { get; set; }
    }

    public class CompanySearchDto
    {
        public string? Keyword { get; set; }
        public bool? IsVerified { get; set; }
        public string? Industry { get; set; }
        public string? Location { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
