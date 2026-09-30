using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data
{
    public class AppDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<Job> Jobs { get; set; } = null!;
        public DbSet<Application> Applications { get; set; } = null!;
        public DbSet<Resume> Resumes { get; set; } = null!;
        public DbSet<Education> Educations { get; set; } = null!;
        public DbSet<WorkExperience> WorkExperiences { get; set; } = null!;
        public DbSet<ResumeSkill> ResumeSkills { get; set; } = null!;
        public DbSet<Certificate> Certificates { get; set; } = null!;
        public DbSet<Language> Languages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Apply configurations
            builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            // Seed data
            SeedData(builder);
        }

        private static void SeedData(ModelBuilder builder)
        {
            // Seed Categories
            builder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Công nghệ thông tin", Description = "Lập trình, phát triển phần mềm, hệ thống", Icon = "code", DisplayOrder = 1, IsActive = true },
                new Category { Id = 2, Name = "Thiết kế & Creative", Description = "UI/UX, Graphic Design, Motion Graphics", Icon = "palette", DisplayOrder = 2, IsActive = true },
                new Category { Id = 3, Name = "Marketing & Sales", Description = "Digital Marketing, Sales, SEO/SEM", Icon = "megaphone", DisplayOrder = 3, IsActive = true },
                new Category { Id = 4, Name = "Kế toán & Tài chính", Description = "Kế toán, Kiểm toán, Tài chính, Ngân hàng", Icon = "calculator", DisplayOrder = 4, IsActive = true },
                new Category { Id = 5, Name = "Nhân sự & Hành chính", Description = "HR, Tuyển dụng, Training, Admin", Icon = "users", DisplayOrder = 5, IsActive = true },
                new Category { Id = 6, Name = "Kỹ thuật & Sản xuất", Description = "Cơ khí, Điện tử, Sản xuất, Chất lượng", Icon = "cog", DisplayOrder = 6, IsActive = true },
                new Category { Id = 7, Name = "Bán hàng & Dịch vụ khách hàng", Description = "Sales, CSKH, Telesales, Retail", Icon = "shopping-cart", DisplayOrder = 7, IsActive = true },
                new Category { Id = 8, Name = "Giáo dục & Đào tạo", Description = "Giáo viên, Trainer, Quản lý đào tạo", Icon = "graduation-cap", DisplayOrder = 8, IsActive = true }
            );

            // Seed Roles
            builder.Entity<IdentityRole<int>>().HasData(
                new IdentityRole<int> { Id = 1, Name = "Admin", NormalizedName = "ADMIN", ConcurrencyStamp = "1" },
                new IdentityRole<int> { Id = 2, Name = "Employer", NormalizedName = "EMPLOYER", ConcurrencyStamp = "2" },
                new IdentityRole<int> { Id = 3, Name = "Candidate", NormalizedName = "CANDIDATE", ConcurrencyStamp = "3" }
            );
        }
    }
}
