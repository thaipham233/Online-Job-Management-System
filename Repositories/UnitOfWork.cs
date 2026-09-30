using Microsoft.EntityFrameworkCore.Storage;
using Online_Job_Management_System.Data;
using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IDbContextTransaction? _transaction;

        private IUserRepository? _users;
        private ICompanyRepository? _companies;
        private ICategoryRepository? _categories;
        private IJobRepository? _jobs;
        private IApplicationRepository? _applications;
        private IResumeRepository? _resumes;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }

        public IUserRepository Users => _users ??= new UserRepository(_context);
        public ICompanyRepository Companies => _companies ??= new CompanyRepository(_context);
        public ICategoryRepository Categories => _categories ??= new CategoryRepository(_context);
        public IJobRepository Jobs => _jobs ??= new JobRepository(_context);
        public IApplicationRepository Applications => _applications ??= new ApplicationRepository(_context);
        public IResumeRepository Resumes => _resumes ??= new ResumeRepository(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
