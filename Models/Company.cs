using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.Models
{
    [Table("Companies")]
    public class Company
    {
        [Dapper.Contrib.Extensions.ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(500)]
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

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsVerified { get; set; } = false;

        public int UserId { get; set; }

        [Computed]
        public virtual User User { get; set; } = null!;

        [Computed]
        public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
    }
}
