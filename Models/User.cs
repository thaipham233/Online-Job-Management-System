using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.Models
{
    [Table("Users")]
    public class User
    {
        [Dapper.Contrib.Extensions.ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(256)]
        public string UserName { get; set; } = string.Empty;

        [MaxLength(256)]
        public string NormalizedUserName { get; set; } = string.Empty;

        [MaxLength(256)]
        public string NormalizedEmail { get; set; } = string.Empty;

        public bool EmailConfirmed { get; set; } = false;

        public string PasswordHash { get; set; } = string.Empty;

        public string SecurityStamp { get; set; } = string.Empty;

        public string ConcurrencyStamp { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        public bool PhoneNumberConfirmed { get; set; } = false;

        public bool TwoFactorEnabled { get; set; } = false;

        public DateTimeOffset? LockoutEnd { get; set; }

        public bool LockoutEnabled { get; set; } = true;

        public int AccessFailedCount { get; set; } = 0;

        [MaxLength(500)]
        public string? AvatarUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public bool IsActive { get; set; } = true;

        [Computed]
        public virtual ICollection<Application> Applications { get; set; } = new List<Application>();

        [Computed]
        public virtual ICollection<Resume> Resumes { get; set; } = new List<Resume>();

        [Computed]
        public virtual Company? Company { get; set; }
    }
}
