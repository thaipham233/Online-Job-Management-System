using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(string whereClause, object? parameters = null);
        Task<T?> FirstOrDefaultAsync(string whereClause, object? parameters = null);
        Task<int> AddAsync(T entity);
        Task AddRangeAsync(IEnumerable<T> entities);
        Task<bool> UpdateAsync(T entity);
        Task<bool> DeleteAsync(int id);
        Task<int> CountAsync(string? whereClause = null, object? parameters = null);
        Task<bool> ExistsAsync(string whereClause, object? parameters = null);
    }
}
