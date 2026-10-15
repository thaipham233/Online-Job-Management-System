namespace Online_Job_Management_System.DTOs.Admin
{
    public class AdminStatsDto
    {
        public UserStatsDto Users { get; set; } = new();
        public CompanyStatsDto Companies { get; set; } = new();
        public JobStatsDto Jobs { get; set; } = new();
        public ApplicationStatsDto Applications { get; set; } = new();
    }

    public class UserStatsDto
    {
        public int Total { get; set; }
        public int Candidates { get; set; }
        public int Employers { get; set; }
        public int Admins { get; set; }
        public int NewThisMonth { get; set; }
    }

    public class CompanyStatsDto
    {
        public int Total { get; set; }
        public int Verified { get; set; }
        public int Pending { get; set; }
        public int NewThisMonth { get; set; }
    }

    public class JobStatsDto
    {
        public int Total { get; set; }
        public int Open { get; set; }
        public int Closed { get; set; }
        public int Draft { get; set; }
        public int NewThisMonth { get; set; }
    }

    public class ApplicationStatsDto
    {
        public int Total { get; set; }
        public int Pending { get; set; }
        public int Processed { get; set; }
        public int NewThisMonth { get; set; }
    }
}
