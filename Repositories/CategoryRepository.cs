using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(IConfiguration configuration) : base(configuration) { }

        public async Task<IEnumerable<Category>> GetRootCategoriesAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<Category>(
                "SELECT * FROM Categories WHERE ParentCategoryId IS NULL AND IsActive = 1 ORDER BY DisplayOrder");
        }

        public async Task<IEnumerable<Category>> GetSubCategoriesAsync(int parentId)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<Category>(
                "SELECT * FROM Categories WHERE ParentCategoryId = @ParentId AND IsActive = 1 ORDER BY DisplayOrder",
                new { ParentId = parentId });
        }

        public async Task<Category?> GetWithSubCategoriesAsync(int id)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT c.*, sc.* 
                FROM Categories c
                LEFT JOIN Categories sc ON sc.ParentCategoryId = c.Id AND sc.IsActive = 1
                WHERE c.Id = @Id";
            
            var categoryDict = new Dictionary<int, Category>();
            await connection.QueryAsync<Category, Category, Category>(sql,
                (c, sc) =>
                {
                    if (!categoryDict.TryGetValue(c.Id, out var category))
                    {
                        category = c;
                        category.SubCategories = new List<Category>();
                        categoryDict.Add(c.Id, category);
                    }
                    if (sc != null && sc.Id > 0)
                        category.SubCategories.Add(sc);
                    return category;
                },
                new { Id = id },
                splitOn: "Id");
            
            return categoryDict.Values.FirstOrDefault();
        }

        public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<Category>(
                "SELECT * FROM Categories WHERE IsActive = 1 ORDER BY DisplayOrder");
        }
    }
}
