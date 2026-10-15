namespace Online_Job_Management_System.DTOs.Admin
{
    public class UpdateUserStatusDto
    {
        public bool IsActive { get; set; }
    }

    public class UpdateUserRolesDto
    {
        public List<string> Roles { get; set; } = new();
    }

    public class VerifyCompanyDto
    {
        public bool IsVerified { get; set; }
    }

    public class UpdateJobStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}
