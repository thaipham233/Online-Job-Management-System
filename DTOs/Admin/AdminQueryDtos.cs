namespace Online_Job_Management_System.DTOs.Admin
{
    public class AdminUserQueryDto : PagedRequest
    {
        public string? Role { get; set; }
        public string? Search { get; set; }
        public string? Status { get; set; }
    }

    public class AdminCompanyQueryDto : PagedRequest
    {
        public string? Search { get; set; }
        public bool? Verified { get; set; }
    }

    public class AdminJobQueryDto : PagedRequest
    {
        public string? Search { get; set; }
        public string? Status { get; set; }
    }

    public class AdminCategoryQueryDto : PagedRequest
    {
        public string? Search { get; set; }
    }
}
