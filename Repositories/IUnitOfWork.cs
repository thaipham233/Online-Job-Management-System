using Online_Job_Management_System.Repositories;

namespace Online_Job_Management_System.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IUserRepository Users { get; }
        ICompanyRepository Companies { get; }
        ICategoryRepository Categories { get; }
        IJobRepository Jobs { get; }
        IApplicationRepository Applications { get; }
        IResumeRepository Resumes { get; }
        
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
