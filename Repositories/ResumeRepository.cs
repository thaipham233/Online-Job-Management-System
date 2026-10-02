using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Repositories
{
    public class ResumeRepository : GenericRepository<Resume>, IResumeRepository
    {
        public ResumeRepository(string connectionString) : base(connectionString) { }

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

        // Education
        public async Task<Education?> GetEducationByIdAsync(int id)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Education>(
                "SELECT * FROM Educations WHERE Id = @Id", new { Id = id });
        }

        public async Task<IEnumerable<Education>> GetEducationsByResumeAsync(int resumeId)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<Education>(
                "SELECT * FROM Educations WHERE ResumeId = @ResumeId ORDER BY EndDate DESC",
                new { ResumeId = resumeId });
        }

        public async Task<int> AddEducationAsync(Education education)
        {
            using var connection = CreateConnection();
            var sql = @"
                INSERT INTO Educations (Institution, Degree, FieldOfStudy, StartDate, EndDate, IsCurrentlyStudying, Description, GPA, ResumeId)
                VALUES (@Institution, @Degree, @FieldOfStudy, @StartDate, @EndDate, @IsCurrentlyStudying, @Description, @GPA, @ResumeId);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            return await connection.QuerySingleAsync<int>(sql, education);
        }

        public async Task<bool> UpdateEducationAsync(Education education)
        {
            using var connection = CreateConnection();
            var sql = @"
                UPDATE Educations SET 
                    Institution = @Institution, Degree = @Degree, FieldOfStudy = @FieldOfStudy,
                    StartDate = @StartDate, EndDate = @EndDate, IsCurrentlyStudying = @IsCurrentlyStudying,
                    Description = @Description, GPA = @GPA
                WHERE Id = @Id";
            var rows = await connection.ExecuteAsync(sql, education);
            return rows > 0;
        }

        public async Task<bool> DeleteEducationAsync(int id)
        {
            using var connection = CreateConnection();
            var rows = await connection.ExecuteAsync("DELETE FROM Educations WHERE Id = @Id", new { Id = id });
            return rows > 0;
        }

        // WorkExperience
        public async Task<WorkExperience?> GetWorkExperienceByIdAsync(int id)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<WorkExperience>(
                "SELECT * FROM WorkExperiences WHERE Id = @Id", new { Id = id });
        }

        public async Task<IEnumerable<WorkExperience>> GetWorkExperiencesByResumeAsync(int resumeId)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<WorkExperience>(
                "SELECT * FROM WorkExperiences WHERE ResumeId = @ResumeId ORDER BY StartDate DESC",
                new { ResumeId = resumeId });
        }

        public async Task<int> AddWorkExperienceAsync(WorkExperience workExperience)
        {
            using var connection = CreateConnection();
            var sql = @"
                INSERT INTO WorkExperiences (Company, Position, Location, StartDate, EndDate, IsCurrentJob, Description, ResumeId)
                VALUES (@Company, @Position, @Location, @StartDate, @EndDate, @IsCurrentJob, @Description, @ResumeId);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            return await connection.QuerySingleAsync<int>(sql, workExperience);
        }

        public async Task<bool> UpdateWorkExperienceAsync(WorkExperience workExperience)
        {
            using var connection = CreateConnection();
            var sql = @"
                UPDATE WorkExperiences SET 
                    Company = @Company, Position = @Position, Location = @Location,
                    StartDate = @StartDate, EndDate = @EndDate, IsCurrentJob = @IsCurrentJob,
                    Description = @Description
                WHERE Id = @Id";
            var rows = await connection.ExecuteAsync(sql, workExperience);
            return rows > 0;
        }

        public async Task<bool> DeleteWorkExperienceAsync(int id)
        {
            using var connection = CreateConnection();
            var rows = await connection.ExecuteAsync("DELETE FROM WorkExperiences WHERE Id = @Id", new { Id = id });
            return rows > 0;
        }

        // ResumeSkill
        public async Task<ResumeSkill?> GetResumeSkillByIdAsync(int id)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ResumeSkill>(
                "SELECT * FROM ResumeSkills WHERE Id = @Id", new { Id = id });
        }

        public async Task<IEnumerable<ResumeSkill>> GetResumeSkillsByResumeAsync(int resumeId)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<ResumeSkill>(
                "SELECT * FROM ResumeSkills WHERE ResumeId = @ResumeId ORDER BY SkillName",
                new { ResumeId = resumeId });
        }

        public async Task<int> AddResumeSkillAsync(ResumeSkill resumeSkill)
        {
            using var connection = CreateConnection();
            var sql = @"
                INSERT INTO ResumeSkills (SkillName, Level, YearsOfExperience, ResumeId)
                VALUES (@SkillName, @Level, @YearsOfExperience, @ResumeId);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            return await connection.QuerySingleAsync<int>(sql, resumeSkill);
        }

        public async Task<bool> UpdateResumeSkillAsync(ResumeSkill resumeSkill)
        {
            using var connection = CreateConnection();
            var sql = @"
                UPDATE ResumeSkills SET 
                    SkillName = @SkillName, Level = @Level, YearsOfExperience = @YearsOfExperience
                WHERE Id = @Id";
            var rows = await connection.ExecuteAsync(sql, resumeSkill);
            return rows > 0;
        }

        public async Task<bool> DeleteResumeSkillAsync(int id)
        {
            using var connection = CreateConnection();
            var rows = await connection.ExecuteAsync("DELETE FROM ResumeSkills WHERE Id = @Id", new { Id = id });
            return rows > 0;
        }

        // Certificate
        public async Task<Certificate?> GetCertificateByIdAsync(int id)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Certificate>(
                "SELECT * FROM Certificates WHERE Id = @Id", new { Id = id });
        }

        public async Task<IEnumerable<Certificate>> GetCertificatesByResumeAsync(int resumeId)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<Certificate>(
                "SELECT * FROM Certificates WHERE ResumeId = @ResumeId ORDER BY IssueDate DESC",
                new { ResumeId = resumeId });
        }

        public async Task<int> AddCertificateAsync(Certificate certificate)
        {
            using var connection = CreateConnection();
            var sql = @"
                INSERT INTO Certificates (Name, IssuingOrganization, IssueDate, ExpiryDate, CredentialId, CredentialUrl, ResumeId)
                VALUES (@Name, @IssuingOrganization, @IssueDate, @ExpiryDate, @CredentialId, @CredentialUrl, @ResumeId);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            return await connection.QuerySingleAsync<int>(sql, certificate);
        }

        public async Task<bool> UpdateCertificateAsync(Certificate certificate)
        {
            using var connection = CreateConnection();
            var sql = @"
                UPDATE Certificates SET 
                    Name = @Name, IssuingOrganization = @IssuingOrganization,
                    IssueDate = @IssueDate, ExpiryDate = @ExpiryDate,
                    CredentialId = @CredentialId, CredentialUrl = @CredentialUrl
                WHERE Id = @Id";
            var rows = await connection.ExecuteAsync(sql, certificate);
            return rows > 0;
        }

        public async Task<bool> DeleteCertificateAsync(int id)
        {
            using var connection = CreateConnection();
            var rows = await connection.ExecuteAsync("DELETE FROM Certificates WHERE Id = @Id", new { Id = id });
            return rows > 0;
        }

        // Language
        public async Task<Language?> GetLanguageByIdAsync(int id)
        {
            using var connection = CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Language>(
                "SELECT * FROM Languages WHERE Id = @Id", new { Id = id });
        }

        public async Task<IEnumerable<Language>> GetLanguagesByResumeAsync(int resumeId)
        {
            using var connection = CreateConnection();
            return await connection.QueryAsync<Language>(
                "SELECT * FROM Languages WHERE ResumeId = @ResumeId ORDER BY Name",
                new { ResumeId = resumeId });
        }

        public async Task<int> AddLanguageAsync(Language language)
        {
            using var connection = CreateConnection();
            var sql = @"
                INSERT INTO Languages (Name, Proficiency, ResumeId)
                VALUES (@Name, @Proficiency, @ResumeId);
                SELECT CAST(SCOPE_IDENTITY() as int)";
            return await connection.QuerySingleAsync<int>(sql, language);
        }

        public async Task<bool> UpdateLanguageAsync(Language language)
        {
            using var connection = CreateConnection();
            var sql = @"
                UPDATE Languages SET 
                    Name = @Name, Proficiency = @Proficiency
                WHERE Id = @Id";
            var rows = await connection.ExecuteAsync(sql, language);
            return rows > 0;
        }

        public async Task<bool> DeleteLanguageAsync(int id)
        {
            using var connection = CreateConnection();
            var rows = await connection.ExecuteAsync("DELETE FROM Languages WHERE Id = @Id", new { Id = id });
            return rows > 0;
        }
    }
}
