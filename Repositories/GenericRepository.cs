using Dapper;
using Dapper.Contrib.Extensions;
using Microsoft.Data.SqlClient;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly string _connectionString;
        private readonly string _tableName;

        public GenericRepository(string connectionString)
        {
            _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));
            
            var tableAttr = typeof(T).GetCustomAttributes(typeof(TableAttribute), false).FirstOrDefault() as TableAttribute;
            _tableName = tableAttr?.Name ?? typeof(T).Name + "s";
        }

        protected IDbConnection CreateConnection()
        {
            return new SqlConnection(_connectionString);
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            using var connection = CreateConnection();
            return await connection.GetAsync<T>(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            using var connection = CreateConnection();
            return await connection.GetAllAsync<T>();
        }

        public virtual async Task<IEnumerable<T>> FindAsync(string whereClause, object? parameters = null)
        {
            using var connection = CreateConnection();
            var sql = $"SELECT * FROM {_tableName} WHERE {whereClause}";
            return await connection.QueryAsync<T>(sql, parameters);
        }

        public virtual async Task<T?> FirstOrDefaultAsync(string whereClause, object? parameters = null)
        {
            using var connection = CreateConnection();
            var sql = $"SELECT TOP 1 * FROM {_tableName} WHERE {whereClause}";
            return await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
        }

        public virtual async Task<int> AddAsync(T entity)
        {
            using var connection = CreateConnection();
            return await connection.InsertAsync(entity);
        }

        public virtual async Task AddRangeAsync(IEnumerable<T> entities)
        {
            using var connection = CreateConnection();
            await connection.InsertAsync(entities);
        }

        public virtual async Task<bool> UpdateAsync(T entity)
        {
            using var connection = CreateConnection();
            return await connection.UpdateAsync(entity);
        }

        public virtual async Task<bool> DeleteAsync(int id)
        {
            using var connection = CreateConnection();
            var entity = await connection.GetAsync<T>(id);
            if (entity == null) return false;
            return await connection.DeleteAsync(entity);
        }

        public virtual async Task<int> CountAsync(string? whereClause = null, object? parameters = null)
        {
            using var connection = CreateConnection();
            var sql = string.IsNullOrEmpty(whereClause) 
                ? $"SELECT COUNT(*) FROM {_tableName}"
                : $"SELECT COUNT(*) FROM {_tableName} WHERE {whereClause}";
            return await connection.ExecuteScalarAsync<int>(sql, parameters);
        }

        public virtual async Task<bool> ExistsAsync(string whereClause, object? parameters = null)
        {
            var count = await CountAsync(whereClause, parameters);
            return count > 0;
        }
    }
}
