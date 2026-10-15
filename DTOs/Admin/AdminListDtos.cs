namespace Online_Job_Management_System.DTOs.Admin
{
    public class AdminUserListDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AvatarUrl { get; set; }
        public List<string> Roles { get; set; } = new();
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class AdminUserDetailDto : AdminUserListDto
    {
        public string? Address { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? CompanyName { get; set; }
        public int? CompanyId { get; set; }
    }

    public class AdminCompanyListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        public string? Industry { get; set; }
        public string? Size { get; set; }
        public bool IsVerified { get; set; }
        public int JobsCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdminCompanyDetailDto : AdminCompanyListDto
    {
        public string? Description { get; set; }
        public string? Benefits { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public int? FoundedYear { get; set; }
        public string? VideoUrl { get; set; }
        public string? FacebookUrl { get; set; }
        public string? LinkedinUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? GithubUrl { get; set; }
        public string? YoutubeUrl { get; set; }
        public string? OtherUrl { get; set; }
        public string? CoverUrl { get; set; }
        public string? Slug { get; set; }
        public int OwnerId { get; set; }
        public string? OwnerEmail { get; set; }
    }

    public class AdminJobListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? JobType { get; set; }
        public string? ExperienceLevel { get; set; }
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? SalaryType { get; set; }
        public string Status { get; set; } = string.Empty;
        public bool IsHot { get; set; }
        public int ApplicationsCount { get; set; }
        public int ViewsCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }

    public class AdminCategoryListDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconClass { get; set; }
        public string? IconColor { get; set; }
        public int DisplayOrder { get; set; }
        public int JobsCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdminCategoryDetailDto : AdminCategoryListDto
    {
    }

    public class AdminCreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string IconClass { get; set; } = "fas fa-tag";
        public string IconColor { get; set; } = "primary";
        public int DisplayOrder { get; set; } = 0;
    }

    public class AdminUpdateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string IconClass { get; set; } = "fas fa-tag";
        public string IconColor { get; set; } = "primary";
        public int DisplayOrder { get; set; } = 0;
    }
}
