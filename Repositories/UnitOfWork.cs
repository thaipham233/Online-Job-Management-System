using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly string _connectionString;
        private IDbConnection? _connection;
        private IDbTransaction? _transaction;

        private IUserRepository? _users;
        private ICompanyRepository? _companies;
        private ICategoryRepository? _categories;
        private IJobRepository? _jobs;
        private IApplicationRepository? _applications;
        private IResumeRepository? _resumes;

        public UnitOfWork(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found");
        }

        private IDbConnection Connection => _connection ??= new SqlConnection(_connectionString);

        public IUserRepository Users => _users ??= new UserRepository(_connectionString);
        public ICompanyRepository Companies => _companies ??= new CompanyRepository(_connectionString);
        public ICategoryRepository Categories => _categories ??= new CategoryRepository(_connectionString);
        public IJobRepository Jobs => _jobs ??= new JobRepository(_connectionString);
        public IApplicationRepository Applications => _applications ??= new ApplicationRepository(_connectionString);
        public IResumeRepository Resumes => _resumes ??= new ResumeRepository(_connectionString);

        public async Task BeginTransactionAsync()
        {
            if (_connection == null)
                _connection = new SqlConnection(_connectionString);
            
            if (_connection.State != ConnectionState.Open)
                await _connection.OpenAsync();
            
            _transaction = _connection.BeginTransaction();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                _transaction.Commit();
                _transaction.Dispose();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                _transaction.Rollback();
                _transaction.Dispose();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _connection?.Dispose();
        }

        public async ValueTask DisposeAsync()
        {
            if (_transaction != null)
            {
                _transaction.Dispose();
                _transaction = null;
            }
            if (_connection != null)
            {
                await _connection.DisposeAsync();
                _connection = null;
            }
        }
    }
}
