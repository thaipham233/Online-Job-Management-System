using Microsoft.EntityFrameworkCore;
using Online_Job_Management_System.Data;
using Online_Job_Management_System.Models;
using System.Linq.Expressions;

namespace Online_Job_Management_System.Repositories
{
    public class ResumeRepository : GenericRepository<Resume>, IResumeRepository
    {
        public ResumeRepository(AppDbContext context) : base(context) { }

        public async Task<Resume?> GetWithDetailsAsync(int resumeId)
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.Educations)
                .Include(r => r.WorkExperiences)
                .Include(r => r.ResumeSkills)
                .Include(r => r.Certificates)
                .Include(r => r.Languages)
                .FirstOrDefaultAsync(r => r.Id == resumeId);
        }

        public async Task<IEnumerable<Resume>> GetByUserAsync(int userId)
        {
            return await _dbSet
                .Include(r => r.Educations)
                .Include(r => r.WorkExperiences)
                .Include(r => r.ResumeSkills)
                .Include(r => r.Certificates)
                .Include(r => r.Languages)
                .Where(r => r.UserId == userId)
                .OrderByDescending(r => r.IsDefault)
                .ThenByDescending(r => r.UpdatedAt ?? r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Resume?> GetDefaultResumeAsync(int userId)
        {
            return await _dbSet
                .Include(r => r.Educations)
                .Include(r => r.WorkExperiences)
                .Include(r => r.ResumeSkills)
                .Include(r => r.Certificates)
                .Include(r => r.Languages)
                .FirstOrDefaultAsync(r => r.UserId == userId && r.IsDefault);
        }

        public async Task SetDefaultResumeAsync(int userId, int resumeId)
        {
            // Reset all to non-default
            var userResumes = await _dbSet.Where(r => r.UserId == userId).ToListAsync();
            foreach (var resume in userResumes)
            {
                resume.IsDefault = resume.Id == resumeId;
                resume.UpdatedAt = DateTime.UtcNow;
            }
            _dbSet.UpdateRange(userResumes);
        }

        public async Task<IEnumerable<Resume>> GetPublicResumesAsync(int skip = 0, int take = 10)
        {
            return await _dbSet
                .Include(r => r.User)
                .Include(r => r.Educations)
                .Include(r => r.WorkExperiences)
                .Include(r => r.ResumeSkills)
                .Where(r => r.IsPublic)
                .OrderByDescending(r => r.UpdatedAt ?? r.CreatedAt)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }
    }
}
