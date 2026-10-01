using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.Data.SqlClient;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public interface IUnitOfWork : IDisposable, IAsyncDisposable
    {
        IUserRepository Users { get; }
        ICompanyRepository Companies { get; }
        ICategoryRepository Categories { get; }
        IJobRepository Jobs { get; }
        IApplicationRepository Applications { get; }
        IResumeRepository Resumes { get; }
        
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
