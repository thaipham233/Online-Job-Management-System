using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Dapper;
using System.Data;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            // First, ensure database exists (tables should be created via migrations or separately)
            await EnsureDatabaseAsync(serviceProvider);

            using var scope = serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

            // Seed roles if not exist
            string[] roles = { "Admin", "Employer", "Candidate" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(role));
                }
            }

            // Seed admin user if not exist
            var adminEmail = "admin@jobsystem.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    NormalizedUserName = adminEmail.ToUpperInvariant(),
                    NormalizedEmail = adminEmail.ToUpperInvariant(),
                    FullName = "System Administrator",
                    EmailConfirmed = true,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    ConcurrencyStamp = Guid.NewGuid().ToString(),
                    LockoutEnabled = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Seed categories using Dapper
            await SeedCategoriesAsync(scope.ServiceProvider);
        }

        private static async Task EnsureDatabaseAsync(IServiceProvider serviceProvider)
        {
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Parse connection string to get server and database
            var builder = new SqlConnectionStringBuilder(connectionString);
            var databaseName = builder.InitialCatalog;
            builder.InitialCatalog = "master"; // Connect to master to create database

            using var masterConnection = new SqlConnection(builder.ConnectionString);
            await masterConnection.OpenAsync();

            // Check if database exists
            var dbExists = await masterConnection.ExecuteScalarAsync<int>(
                "SELECT COUNT(*) FROM sys.databases WHERE name = @dbName", new { dbName = databaseName });

            if (dbExists == 0)
            {
                // Create database
                await masterConnection.ExecuteAsync($"CREATE DATABASE [{databaseName}]");
            }
        }

        private static async Task SeedCategoriesAsync(IServiceProvider serviceProvider)
        {
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            using var connection = new SqlConnection(connectionString);
            await connection.OpenAsync();

            // Check if categories already exist
            var count = await connection.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM Categories");
            if (count > 0) return;

            var categories = new[]
            {
                new { Name = "Công nghệ thông tin", Description = "Lập trình, phát triển phần mềm, hệ thống", Icon = "code", DisplayOrder = 1, IsActive = true, ParentCategoryId = (int?)null },
                new { Name = "Thiết kế & Creative", Description = "UI/UX, Graphic Design, Motion Graphics", Icon = "palette", DisplayOrder = 2, IsActive = true, ParentCategoryId = (int?)null },
                new { Name = "Marketing & Sales", Description = "Digital Marketing, Sales, SEO/SEM", Icon = "megaphone", DisplayOrder = 3, IsActive = true, ParentCategoryId = (int?)null },
                new { Name = "Kế toán & Tài chính", Description = "Kế toán, Kiểm toán, Tài chính, Ngân hàng", Icon = "calculator", DisplayOrder = 4, IsActive = true, ParentCategoryId = (int?)null },
                new { Name = "Nhân sự & Hành chính", Description = "HR, Tuyển dụng, Training, Admin", Icon = "users", DisplayOrder = 5, IsActive = true, ParentCategoryId = (int?)null },
                new { Name = "Kỹ thuật & Sản xuất", Description = "Cơ khí, Điện tử, Sản xuất, Chất lượng", Icon = "cog", DisplayOrder = 6, IsActive = true, ParentCategoryId = (int?)null },
                new { Name = "Bán hàng & Dịch vụ khách hàng", Description = "Sales, CSKH, Telesales, Retail", Icon = "shopping-cart", DisplayOrder = 7, IsActive = true, ParentCategoryId = (int?)null },
                new { Name = "Giáo dục & Đào tạo", Description = "Giáo viên, Trainer, Quản lý đào tạo", Icon = "graduation-cap", DisplayOrder = 8, IsActive = true, ParentCategoryId = (int?)null }
            };

            var sql = @"
                INSERT INTO Categories (Name, Description, Icon, DisplayOrder, IsActive, ParentCategoryId)
                VALUES (@Name, @Description, @Icon, @DisplayOrder, @IsActive, @ParentCategoryId)";

            await connection.ExecuteAsync(sql, categories);
        }
    }
}