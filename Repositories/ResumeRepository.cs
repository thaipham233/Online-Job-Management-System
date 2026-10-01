using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class ResumeRepository : GenericRepository<Resume>, IResumeRepository
    {
        public ResumeRepository(IConfiguration configuration) : base(configuration) { }

        public async Task<Resume?> GetWithDetailsAsync(int resumeId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT r.*, u.*, e.*, we.*, rs.*, c.*, l.*
                FROM Resumes r
                LEFT JOIN Users u ON u.Id = r.UserId
                LEFT JOIN Educations e ON e.ResumeId = r.Id
                LEFT JOIN WorkExperiences we ON we.ResumeId = r.Id
                LEFT JOIN ResumeSkills rs ON rs.ResumeId = r.Id
                LEFT JOIN Certificates c ON c.ResumeId = r.Id
                LEFT JOIN Languages l ON l.ResumeId = r.Id
                WHERE r.Id = @ResumeId";
            
            var resumeDict = new Dictionary<int, Resume>();
            await connection.QueryAsync<Resume, User, Education, WorkExperience, ResumeSkill, Certificate, Language, Resume>(sql,
                (r, u, e, we, rs, c, l) =>
                {
                    if (!resumeDict.TryGetValue(r.Id, out var resume))
                    {
                        resume = r;
                        resume.User = u;
                        resume.Educations = new List<Education>();
                        resume.WorkExperiences = new List<WorkExperience>();
                        resume.ResumeSkills = new List<ResumeSkill>();
                        resume.Certificates = new List<Certificate>();
                        resume.Languages = new List<Language>();
                        resumeDict.Add(r.Id, resume);
                    }
                    if (e != null && e.Id > 0) resume.Educations.Add(e);
                    if (we != null && we.Id > 0) resume.WorkExperiences.Add(we);
                    if (rs != null && rs.Id > 0) resume.ResumeSkills.Add(rs);
                    if (c != null && c.Id > 0) resume.Certificates.Add(c);
                    if (l != null && l.Id > 0) resume.Languages.Add(l);
                    return resume;
                },
                new { ResumeId = resumeId },
                splitOn: "Id,Id,Id,Id,Id,Id");
            
            return resumeDict.Values.FirstOrDefault();
        }

        public async Task<IEnumerable<Resume>> GetByUserAsync(int userId)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT r.*, e.*, we.*, rs.*, c.*, l.*
                FROM Resumes r
                LEFT JOIN Educations e ON e.ResumeId = r.Id
                LEFT JOIN WorkExperiences we ON we.ResumeId = r.Id
                LEFT JOIN ResumeSkills rs ON rs.ResumeId = r.Id
                LEFT JOIN Certificates c ON c.ResumeId = r.Id
                LEFT JOIN Languages l ON l.ResumeId = r.Id
                WHERE r.UserId = @UserId
                ORDER BY r.IsDefault DESC, COALESCE(r.UpdatedAt, r.CreatedAt) DESC";
            
            var resumeDict = new Dictionary<int, Resume>();
            await connection.QueryAsync<Resume, Education, WorkExperience, ResumeSkill, Certificate, Language, Resume>(sql,
                (r, e, we, rs, c, l) =>
                {
                    if (!resumeDict.TryGetValue(r.Id, out var resume))
                    {
                        resume = r;
                        resume.Educations = new List<Education>();
                        resume.WorkExperiences = new List<WorkExperience>();
                        resume.ResumeSkills = new List<ResumeSkill>();
                        resume.Certificates = new List<Certificate>();
                        resume.Languages = new List<Language>();
                        resumeDict.Add(r.Id, resume);
                    }
                    if (e != null && e.Id > 0) resume.Educations.Add(e);
                    if (we != null && we.Id > 0) resume.WorkExperiences.Add(we);
                    if (rs != null && rs.Id > 0) resume.ResumeSkills.Add(rs);
                    if (c != null && c.Id > 0) resume.Certificates.Add(c);
                    if (l != null && l.Id > 0) resume.Languages.Add(l);
                    return resume;
                },
                new { UserId = userId },
                splitOn: "Id,Id,Id,Id,Id");
            
            return resumeDict.Values;
        }

        public async Task<Resume?> GetDefaultResumeAsync(int userId)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Resume>(
                "SELECT * FROM Resumes WHERE UserId = @UserId AND IsDefault = 1",
                new { UserId = userId });
        }

        public async Task SetDefaultResumeAsync(int userId, int resumeId)
        {
            using var connection = CreateConnection();
            using var transaction = connection.BeginTransaction();
            try
            {
                // Reset all to non-default
                await connection.ExecuteAsync(
                    "UPDATE Resumes SET IsDefault = 0, UpdatedAt = GETUTCDATE() WHERE UserId = @UserId",
                    new { UserId = userId }, transaction);

                // Set new default
                await connection.ExecuteAsync(
                    "UPDATE Resumes SET IsDefault = 1, UpdatedAt = GETUTCDATE() WHERE Id = @ResumeId AND UserId = @UserId",
                    new { ResumeId = resumeId, UserId = userId }, transaction);

                transaction.Commit();
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }

        public async Task<IEnumerable<Resume>> GetPublicResumesAsync(int skip = 0, int take = 10)
        {
            using var connection = CreateConnection();
            var sql = @"
                SELECT r.*, u.*, e.*, we.*, rs.*
                FROM Resumes r
                LEFT JOIN Users u ON u.Id = r.UserId
                LEFT JOIN Educations e ON e.ResumeId = r.Id
                LEFT JOIN WorkExperiences we ON we.ResumeId = r.Id
                LEFT JOIN ResumeSkills rs ON rs.ResumeId = r.Id
                WHERE r.IsPublic = 1
                ORDER BY COALESCE(r.UpdatedAt, r.CreatedAt) DESC
                OFFSET @Skip ROWS FETCH NEXT @Take ROWS ONLY";
            
            var resumeDict = new Dictionary<int, Resume>();
            await connection.QueryAsync<Resume, User, Education, WorkExperience, ResumeSkill, Resume>(sql,
                (r, u, e, we, rs) =>
                {
                    if (!resumeDict.TryGetValue(r.Id, out var resume))
                    {
                        resume = r;
                        resume.User = u;
                        resume.Educations = new List<Education>();
                        resume.WorkExperiences = new List<WorkExperience>();
                        resume.ResumeSkills = new List<ResumeSkill>();
                        resumeDict.Add(r.Id, resume);
                    }
                    if (e != null && e.Id > 0) resume.Educations.Add(e);
                    if (we != null && we.Id > 0) resume.WorkExperiences.Add(we);
                    if (rs != null && rs.Id > 0) resume.ResumeSkills.Add(rs);
                    return resume;
                },
                new { Skip = skip, Take = take },
                splitOn: "Id,Id,Id,Id");
            
            return resumeDict.Values;
        }
    }
}
