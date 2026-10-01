using Dapper.Contrib.Extensions;
using System.ComponentModel.DataAnnotations;

namespace Online_Job_Management_System.Models
{
    [Table("Categories")]
    public class Category
    {
        [Key]
        [ExplicitKey]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(50)]
        public string? Icon { get; set; }

        public int? ParentCategoryId { get; set; }

        [Computed]
        public virtual Category? ParentCategory { get; set; }

        [Computed]
        public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();

        [Computed]
        public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();

        public int DisplayOrder { get; set; } = 0;

        public bool IsActive { get; set; } = true;
    }
}
