/*
================================================================================
ONLINE JOB MANAGEMENT SYSTEM - DATABASE SCHEMA & SAMPLE DATA
================================================================================
This script creates all tables with proper constraints and inserts 10 sample
records per table for testing and development purposes.

Tables (in dependency order):
1. Users           - Identity users
2. Roles           - Identity roles
3. UserRoles       - User-Role many-to-many
4. UserClaims      - User claims
5. UserLogins      - External logins
6. UserTokens      - Auth tokens
7. RoleClaims      - Role claims
8. Companies       - Employer companies
9. Categories      - Job categories (self-referencing)
10. Jobs           - Job postings
11. Resumes        - Candidate resumes
12. Educations     - Resume education
13. WorkExperiences - Resume work experience
14. ResumeSkills   - Resume skills
15. Certificates   - Resume certificates
16. Languages      - Resume languages
17. Applications   - Job applications
================================================================================
*/

USE master;
GO

-- Create database if not exists
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'OnlineJobManagementSystem')
BEGIN
    CREATE DATABASE OnlineJobManagementSystem;
END
GO

USE OnlineJobManagementSystem;
GO

-- ============================================================================
-- DROP EXISTING TABLES (in reverse dependency order)
-- ============================================================================
IF OBJECT_ID('Applications', 'U') IS NOT NULL DROP TABLE Applications;
IF OBJECT_ID('Languages', 'U') IS NOT NULL DROP TABLE Languages;
IF OBJECT_ID('Certificates', 'U') IS NOT NULL DROP TABLE Certificates;
IF OBJECT_ID('ResumeSkills', 'U') IS NOT NULL DROP TABLE ResumeSkills;
IF OBJECT_ID('WorkExperiences', 'U') IS NOT NULL DROP TABLE WorkExperiences;
IF OBJECT_ID('Educations', 'U') IS NOT NULL DROP TABLE Educations;
IF OBJECT_ID('Resumes', 'U') IS NOT NULL DROP TABLE Resumes;
IF OBJECT_ID('Jobs', 'U') IS NOT NULL DROP TABLE Jobs;
IF OBJECT_ID('Categories', 'U') IS NOT NULL DROP TABLE Categories;
IF OBJECT_ID('Companies', 'U') IS NOT NULL DROP TABLE Companies;
IF OBJECT_ID('RoleClaims', 'U') IS NOT NULL DROP TABLE RoleClaims;
IF OBJECT_ID('UserTokens', 'U') IS NOT NULL DROP TABLE UserTokens;
IF OBJECT_ID('UserLogins', 'U') IS NOT NULL DROP TABLE UserLogins;
IF OBJECT_ID('UserClaims', 'U') IS NOT NULL DROP TABLE UserClaims;
IF OBJECT_ID('UserRoles', 'U') IS NOT NULL DROP TABLE UserRoles;
IF OBJECT_ID('Roles', 'U') IS NOT NULL DROP TABLE Roles;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;
GO

-- ============================================================================
-- CREATE TABLES
-- ============================================================================

-- 1. Users (Identity)
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(256) NOT NULL,
    NormalizedUserName NVARCHAR(256) NOT NULL,
    Email NVARCHAR(256) NOT NULL,
    NormalizedEmail NVARCHAR(256) NOT NULL,
    EmailConfirmed BIT NOT NULL DEFAULT 0,
    PasswordHash NVARCHAR(MAX) NULL,
    SecurityStamp NVARCHAR(MAX) NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL,
    PhoneNumber NVARCHAR(20) NULL,
    PhoneNumberConfirmed BIT NOT NULL DEFAULT 0,
    TwoFactorEnabled BIT NOT NULL DEFAULT 0,
    LockoutEnd DATETIMEOFFSET NULL,
    LockoutEnabled BIT NOT NULL DEFAULT 1,
    AccessFailedCount INT NOT NULL DEFAULT 0,
    FullName NVARCHAR(200) NOT NULL,
    AvatarUrl NVARCHAR(500) NULL,
    DateOfBirth DATE NULL,
    Gender INT NULL,
    Address NVARCHAR(500) NULL,
    Bio NVARCHAR(MAX) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

CREATE UNIQUE INDEX IX_Users_NormalizedUserName ON Users(NormalizedUserName);
CREATE UNIQUE INDEX IX_Users_NormalizedEmail ON Users(NormalizedEmail);
CREATE INDEX IX_Users_Email ON Users(Email);
GO

-- 2. Roles (Identity)
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(256) NOT NULL,
    NormalizedName NVARCHAR(256) NOT NULL,
    ConcurrencyStamp NVARCHAR(MAX) NULL
);

CREATE UNIQUE INDEX IX_Roles_NormalizedName ON Roles(NormalizedName);
GO

-- 3. UserRoles (Identity)
CREATE TABLE UserRoles (
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);
GO

-- 4. UserClaims (Identity)
CREATE TABLE UserClaims (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- 5. UserLogins (Identity)
CREATE TABLE UserLogins (
    LoginProvider NVARCHAR(450) NOT NULL,
    ProviderKey NVARCHAR(450) NOT NULL,
    ProviderDisplayName NVARCHAR(MAX) NULL,
    UserId INT NOT NULL,
    PRIMARY KEY (LoginProvider, ProviderKey),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- 6. UserTokens (Identity)
CREATE TABLE UserTokens (
    UserId INT NOT NULL,
    LoginProvider NVARCHAR(450) NOT NULL,
    Name NVARCHAR(450) NOT NULL,
    Value NVARCHAR(MAX) NULL,
    PRIMARY KEY (UserId, LoginProvider, Name),
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
GO

-- 7. RoleClaims (Identity)
CREATE TABLE RoleClaims (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoleId INT NOT NULL,
    ClaimType NVARCHAR(MAX) NULL,
    ClaimValue NVARCHAR(MAX) NULL,
    FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);
GO

-- 8. Companies
CREATE TABLE Companies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Website NVARCHAR(500) NULL,
    LogoUrl NVARCHAR(500) NULL,
    CoverImageUrl NVARCHAR(500) NULL,
    Industry NVARCHAR(100) NULL,
    Size INT NULL,
    Location NVARCHAR(200) NULL,
    PhoneNumber NVARCHAR(50) NULL,
    Email NVARCHAR(256) NULL,
    TaxCode NVARCHAR(50) NULL,
    IsVerified BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_Companies_UserId ON Companies(UserId);
CREATE INDEX IX_Companies_IsActive ON Companies(IsActive);
GO

-- 9. Categories (self-referencing)
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Icon NVARCHAR(100) NULL,
    DisplayOrder INT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,
    ParentCategoryId INT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ParentCategoryId) REFERENCES Categories(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_Categories_ParentCategoryId ON Categories(ParentCategoryId);
CREATE INDEX IX_Categories_IsActive ON Categories(IsActive);
GO

-- 10. Jobs
CREATE TABLE Jobs (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId INT NOT NULL,
    CategoryId INT NOT NULL,
    CreatedByUserId INT NOT NULL,
    Title NVARCHAR(300) NOT NULL,
    ShortDescription NVARCHAR(500) NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Requirements NVARCHAR(MAX) NOT NULL,
    Benefits NVARCHAR(MAX) NOT NULL,
    Location NVARCHAR(100) NULL,
    JobType INT NOT NULL DEFAULT 1,
    ExperienceLevel INT NOT NULL DEFAULT 1,
    SalaryMin DECIMAL(18,2) NULL,
    SalaryMax DECIMAL(18,2) NULL,
    SalaryType INT NOT NULL DEFAULT 4,
    IsNegotiableSalary BIT NOT NULL DEFAULT 0,
    Skills NVARCHAR(200) NULL,
    Quantity INT NOT NULL DEFAULT 1,
    ExpiredDate DATETIME2 NULL,
    Status INT NOT NULL DEFAULT 1,
    ViewCount INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    PublishedAt DATETIME2 NULL,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id) ON DELETE NO ACTION,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id) ON DELETE NO ACTION,
    FOREIGN KEY (CreatedByUserId) REFERENCES Users(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_Jobs_CompanyId ON Jobs(CompanyId);
CREATE INDEX IX_Jobs_CategoryId ON Jobs(CategoryId);
CREATE INDEX IX_Jobs_Status ON Jobs(Status);
CREATE INDEX IX_Jobs_ExpiredDate ON Jobs(ExpiredDate);
GO

-- 11. Resumes
CREATE TABLE Resumes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Summary NVARCHAR(1000) NULL,
    FileUrl NVARCHAR(500) NULL,
    ParsedContent NVARCHAR(MAX) NULL,
    CurrentPosition NVARCHAR(100) NULL,
    CurrentCompany NVARCHAR(200) NULL,
    ExpectedSalary DECIMAL(18,2) NULL,
    PreferredLocation NVARCHAR(100) NULL,
    PreferredJobType INT NULL,
    IsDefault BIT NOT NULL DEFAULT 0,
    IsPublic BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_Resumes_UserId ON Resumes(UserId);
CREATE INDEX IX_Resumes_IsPublic ON Resumes(IsPublic);
GO

-- 12. Educations
CREATE TABLE Educations (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ResumeId INT NOT NULL,
    Institution NVARCHAR(200) NOT NULL,
    Degree NVARCHAR(200) NOT NULL,
    FieldOfStudy NVARCHAR(200) NULL,
    StartDate DATE NULL,
    EndDate DATE NULL,
    IsCurrentlyStudying BIT NOT NULL DEFAULT 0,
    Description NVARCHAR(1000) NULL,
    GPA DECIMAL(3,2) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ResumeId) REFERENCES Resumes(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Educations_ResumeId ON Educations(ResumeId);
GO

-- 13. WorkExperiences
CREATE TABLE WorkExperiences (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ResumeId INT NOT NULL,
    Company NVARCHAR(200) NOT NULL,
    Position NVARCHAR(200) NOT NULL,
    Location NVARCHAR(200) NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NULL,
    IsCurrentJob BIT NOT NULL DEFAULT 0,
    Description NVARCHAR(2000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ResumeId) REFERENCES Resumes(Id) ON DELETE CASCADE
);

CREATE INDEX IX_WorkExperiences_ResumeId ON WorkExperiences(ResumeId);
GO

-- 14. ResumeSkills
CREATE TABLE ResumeSkills (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ResumeId INT NOT NULL,
    SkillName NVARCHAR(100) NOT NULL,
    Level INT NOT NULL DEFAULT 1,
    YearsOfExperience INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ResumeId) REFERENCES Resumes(Id) ON DELETE CASCADE
);

CREATE INDEX IX_ResumeSkills_ResumeId ON ResumeSkills(ResumeId);
GO

-- 15. Certificates
CREATE TABLE Certificates (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ResumeId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    IssuingOrganization NVARCHAR(200) NULL,
    IssueDate DATE NULL,
    ExpiryDate DATE NULL,
    CredentialId NVARCHAR(500) NULL,
    CredentialUrl NVARCHAR(500) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ResumeId) REFERENCES Resumes(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Certificates_ResumeId ON Certificates(ResumeId);
GO

-- 16. Languages
CREATE TABLE Languages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ResumeId INT NOT NULL,
    Name NVARCHAR(50) NOT NULL,
    Proficiency INT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ResumeId) REFERENCES Resumes(Id) ON DELETE CASCADE
);

CREATE INDEX IX_Languages_ResumeId ON Languages(ResumeId);
GO

-- 17. Applications
CREATE TABLE Applications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    JobId INT NOT NULL,
    UserId INT NOT NULL,
    ResumeId INT NULL,
    CoverLetter NVARCHAR(1000) NULL,
    Status INT NOT NULL DEFAULT 1,
    AppliedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ReviewedAt DATETIME2 NULL,
    ReviewedByUserId INT NULL,
    RejectionReason NVARCHAR(1000) NULL,
    Notes NVARCHAR(1000) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (JobId) REFERENCES Jobs(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE NO ACTION,
    FOREIGN KEY (ResumeId) REFERENCES Resumes(Id) ON DELETE SET NULL,
    FOREIGN KEY (ReviewedByUserId) REFERENCES Users(Id) ON DELETE NO ACTION
);

CREATE INDEX IX_Applications_JobId ON Applications(JobId);
CREATE INDEX IX_Applications_UserId ON Applications(UserId);
CREATE INDEX IX_Applications_Status ON Applications(Status);
GO

-- ============================================================================
-- INSERT SAMPLE DATA (10 records per table)
-- ============================================================================

-- 1. Insert Roles
INSERT INTO Roles (Name, NormalizedName, ConcurrencyStamp) VALUES
('Admin', 'ADMIN', NEWID()),
('Employer', 'EMPLOYER', NEWID()),
('Candidate', 'CANDIDATE', NEWID());

-- 2. Insert Users (10 users: 1 admin, 3 employers, 6 candidates)
-- Password hash for "Test@123" (using BCrypt)
DECLARE @PasswordHash NVARCHAR(MAX) = '$2a$11$8K1p/a0dhrxi7bw1rNvwfOmGv1.HWxVO5VJqZ9kLJP9B8qP8J8J8K';
INSERT INTO Users (UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, FullName, AvatarUrl, DateOfBirth, Gender, Address, Bio, IsActive, CreatedAt) VALUES
-- Admin
('admin@jobsystem.com', 'ADMIN@JOBSYSTEM.COM', 'admin@jobsystem.com', 'ADMIN@JOBSYSTEM.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234567', 1, 0, 1, 0, 'Quản trị hệ thống', NULL, '1990-01-01', 1, 'Hà Nội', 'Quản trị viên hệ thống', 1, GETUTCDATE()),
-- Employers
('employer1@company.com', 'EMPLOYER1@COMPANY.COM', 'employer1@company.com', 'EMPLOYER1@COMPANY.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234568', 1, 0, 1, 0, 'Nguyễn Văn An', NULL, '1985-05-15', 1, 'Hà Nội', 'CEO Công ty ABC', 1, GETUTCDATE()),
('employer2@company.com', 'EMPLOYER2@COMPANY.COM', 'employer2@company.com', 'EMPLOYER2@COMPANY.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234569', 1, 0, 1, 0, 'Trần Thị Bình', NULL, '1988-08-20', 2, 'TP.HCM', 'HR Manager XYZ Corp', 1, GETUTCDATE()),
('employer3@company.com', 'EMPLOYER3@COMPANY.COM', 'employer3@company.com', 'EMPLOYER3@COMPANY.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234570', 1, 0, 1, 0, 'Lê Văn Cường', NULL, '1982-12-10', 1, 'Đà Nẵng', 'CTO TechStart', 1, GETUTCDATE()),
-- Candidates
('candidate1@email.com', 'CANDIDATE1@EMAIL.COM', 'candidate1@email.com', 'CANDIDATE1@EMAIL.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234571', 1, 0, 1, 0, 'Phạm Thị Dung', NULL, '1995-03-22', 2, 'Hà Nội', 'Lập trình viên .NET 3 năm kinh nghiệm', 1, GETUTCDATE()),
('candidate2@email.com', 'CANDIDATE2@EMAIL.COM', 'candidate2@email.com', 'CANDIDATE2@EMAIL.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234572', 1, 0, 1, 0, 'Hoàng Văn Em', NULL, '1993-07-18', 1, 'TP.HCM', 'Frontend React Developer', 1, GETUTCDATE()),
('candidate3@email.com', 'CANDIDATE3@EMAIL.COM', 'candidate3@email.com', 'CANDIDATE3@EMAIL.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234573', 1, 0, 1, 0, 'Võ Thị Phương', NULL, '1996-11-05', 2, 'Cần Thơ', 'Backend Java Spring Boot', 1, GETUTCDATE()),
('candidate4@email.com', 'CANDIDATE4@EMAIL.COM', 'candidate4@email.com', 'CANDIDATE4@EMAIL.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234574', 1, 0, 1, 0, 'Đặng Văn Giang', NULL, '1994-09-30', 1, 'Hải Phòng', 'Fullstack Developer', 1, GETUTCDATE()),
('candidate5@email.com', 'CANDIDATE5@EMAIL.COM', 'candidate5@email.com', 'CANDIDATE5@EMAIL.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234575', 1, 0, 1, 0, 'Bùi Thị Hạnh', NULL, '1997-02-14', 2, 'Hà Nội', 'DevOps Engineer', 1, GETUTCDATE()),
('candidate6@email.com', 'CANDIDATE6@EMAIL.COM', 'candidate6@email.com', 'CANDIDATE6@EMAIL.COM', 1, @PasswordHash, NEWID(), NEWID(), '0901234576', 1, 0, 1, 0, 'Ngô Văn Khánh', NULL, '1992-06-25', 1, 'TP.HCM', 'Mobile Developer Flutter', 1, GETUTCDATE());
GO

-- 3. Insert UserRoles
INSERT INTO UserRoles (UserId, RoleId) VALUES
(1, 1),  -- Admin -> Admin
(2, 2),  -- Employer1 -> Employer
(3, 2),  -- Employer2 -> Employer
(4, 2),  -- Employer3 -> Employer
(5, 3),  -- Candidate1 -> Candidate
(6, 3),  -- Candidate2 -> Candidate
(7, 3),  -- Candidate3 -> Candidate
(8, 3),  -- Candidate4 -> Candidate
(9, 3),  -- Candidate5 -> Candidate
(10, 3); -- Candidate6 -> Candidate
GO

-- 4. Insert Companies (3 companies for 3 employers)
INSERT INTO Companies (UserId, Name, Description, Website, LogoUrl, CoverImageUrl, Industry, Size, Location, PhoneNumber, Email, TaxCode, IsVerified, IsActive, CreatedAt) VALUES
(2, 'Công ty TNHH ABC Technology', 'Công ty công nghệ hàng đầu Việt Nam chuyên về giải pháp phần mềm doanh nghiệp', 'https://abctech.vn', 'https://example.com/logos/abc.png', 'https://example.com/covers/abc.jpg', 'Công nghệ thông tin', 200, 'Hà Nội', '024-3987-6543', 'hr@abctech.vn', '0101234567', 1, 1, GETUTCDATE()),
(3, 'XYZ Corporation', 'Tập đoàn đa quốc gia với các mảng: Fintech, E-commerce, AI', 'https://xyzcorp.com', 'https://example.com/logos/xyz.png', 'https://example.com/covers/xyz.jpg', 'Tài chính / Công nghệ', 1000, 'TP.HCM', '028-3827-1234', 'careers@xyzcorp.com', '0301234567', 1, 1, GETUTCDATE()),
(4, 'TechStart Innovation', 'Startup công nghệ tập trung vào AI/ML và Blockchain', 'https://techstart.vn', 'https://example.com/logos/techstart.png', 'https://example.com/covers/techstart.jpg', 'Công nghệ thông tin', 50, 'Đà Nẵng', '0236-3876-543', 'jobs@techstart.vn', '0401234567', 0, 1, GETUTCDATE());
GO

-- 5. Insert Categories (8 parent + 7 sub = 15 total, but we need 10)
INSERT INTO Categories (Name, Description, Icon, DisplayOrder, IsActive, ParentCategoryId, CreatedAt) VALUES
-- Parent categories
('Lập trình & Phát triển', 'Các vị trí lập trình viên, developer', 'code', 1, 1, NULL, GETUTCDATE()),
('Thiết kế & Creative', 'UI/UX, Graphic Design, Motion Graphics', 'palette', 2, 1, NULL, GETUTCDATE()),
('Kiểm thử & QA', 'Quality Assurance, Test Automation', 'bug', 3, 1, NULL, GETUTCDATE()),
('DevOps & Infrastructure', 'DevOps, Cloud, System Admin', 'server', 4, 1, NULL, GETUTCDATE()),
('Data & AI', 'Data Science, Machine Learning, AI', 'database', 5, 1, NULL, GETUTCDATE()),
('Quản lý dự án', 'Project Manager, Scrum Master, Product Owner', 'clipboard', 6, 1, NULL, GETUTCDATE()),
('Business & Phân tích', 'Business Analyst, Product Analyst', 'chart', 7, 1, NULL, GETUTCDATE()),
('Hỗ trợ kỹ thuật', 'Technical Support, Helpdesk, IT Support', 'headset', 8, 1, NULL, GETUTCDATE()),
-- Sub categories
('Frontend', 'React, Vue, Angular, HTML/CSS/JS', 'code', 1, 1, 1, GETUTCDATE()),
('Backend', 'Node.js, .NET, Java, Python, Go, PHP', 'code', 2, 1, 1, GETUTCDATE());
GO

-- 6. Insert Jobs (10 jobs across 3 companies)
INSERT INTO Jobs (CompanyId, CategoryId, CreatedByUserId, Title, ShortDescription, Description, Requirements, Benefits, Location, JobType, ExperienceLevel, SalaryMin, SalaryMax, SalaryType, IsNegotiableSalary, Skills, Quantity, ExpiredDate, Status, ViewCount, CreatedAt, PublishedAt) VALUES
(1, 9, 2, 'Frontend Developer (React)', 'Tuyển Frontend React tại Hà Nội', 'Phát triển giao diện người dùng cho các sản phẩm web', '3 năm kinh nghiệm React, TypeScript, Redux', 'Lương 15-25 triệu, bảo hiểm đầy đủ, du lịch hàng năm', 'Hà Nội', 1, 3, 15000000, 25000000, 4, 1, 'React, TypeScript, Redux, TailwindCSS', 2, DATEADD(DAY, 30, GETUTCDATE()), 3, 150, GETUTCDATE(), GETUTCDATE()),
(1, 10, 2, 'Backend Developer (.NET Core)', 'Tuyển Backend .NET Core', 'Xây dựng API, microservices cho hệ thống core', '3 năm .NET Core, SQL Server, Docker, Kubernetes', 'Lương 18-30 triệu, 13 tháng lương, stock options', 'Hà Nội', 1, 3, 18000000, 30000000, 4, 1, '.NET Core, SQL Server, Docker, K8s', 1, DATEADD(DAY, 30, GETUTCDATE()), 3, 200, GETUTCDATE(), GETUTCDATE()),
(1, 1, 2, 'Fullstack Developer', 'Fullstack cho dự án nội bộ', 'Phát triển end-to-end các tính năng mới', '2 năm Fullstack, React + .NET/Java', 'Lương 15-22 triệu, flexible hours', 'Hà Nội', 1, 2, 15000000, 22000000, 4, 1, 'React, .NET Core, PostgreSQL', 1, DATEADD(DAY, 45, GETUTCDATE()), 3, 80, GETUTCDATE(), GETUTCDATE()),
(2, 1, 3, 'Senior Java Developer', 'Java Spring Boot cho hệ thống Fintech', 'Xây dựng hệ thống thanh toán quy mô lớn', '5 năm Java, Spring Boot, Kafka, Redis', 'Lương 30-50 triệu, bonus project, insurrance', 'TP.HCM', 1, 5, 30000000, 50000000, 4, 1, 'Java, Spring Boot, Kafka, Redis', 3, DATEADD(DAY, 60, GETUTCDATE()), 3, 300, GETUTCDATE(), GETUTCDATE()),
(2, 5, 3, 'Data Scientist', 'Machine Learning cho rủi ro tín dụng', 'Xây dựng mô hình scoring, fraud detection', '3 năm Python, ML, SQL, Spark', 'Lương 25-40 triệu, training budget', 'TP.HCM', 1, 3, 25000000, 40000000, 4, 1, 'Python, TensorFlow, SQL, Spark', 2, DATEADD(DAY, 60, GETUTCDATE()), 3, 120, GETUTCDATE(), GETUTCDATE()),
(2, 4, 3, 'DevOps Engineer', 'Quản trị hạ tầng cloud AWS/Azure', 'CI/CD, Infrastructure as Code, Monitoring', '3 năm AWS, Terraform, Kubernetes, Jenkins', 'Lương 22-35 triệu, cert support', 'TP.HCM', 1, 3, 22000000, 35000000, 4, 1, 'AWS, Terraform, K8s, Jenkins', 1, DATEADD(DAY, 45, GETUTCDATE()), 3, 90, GETUTCDATE(), GETUTCDATE()),
(3, 9, 4, 'React Native Developer', 'Mobile app cho startup AI', 'Phát triển app cross-platform iOS/Android', '2 năm React Native, TypeScript, Redux', 'Lương 15-25 triệu, equity, remote friendly', 'Đà Nẵng', 5, 2, 15000000, 25000000, 4, 1, 'React Native, TypeScript, Firebase', 1, DATEADD(DAY, 30, GETUTCDATE()), 3, 60, GETUTCDATE(), GETUTCDATE()),
(3, 10, 4, 'Backend Go Developer', 'Microservices với Golang', 'High-performance backend services', '2 năm Go, gRPC, PostgreSQL, Docker', 'Lương 18-28 triệu, equity, learning budget', 'Đà Nẵng', 1, 2, 18000000, 28000000, 4, 1, 'Go, gRPC, PostgreSQL, Docker', 2, DATEADD(DAY, 30, GETUTCDATE()), 3, 70, GETUTCDATE(), GETUTCDATE()),
(3, 6, 4, 'Technical Project Manager', 'Quản lý dự án phần mềm', 'Agile/Scrum, stakeholder management', '3 năm PM, PMP/PSM, technical background', 'Lương 20-30 triệu, performance bonus', 'Đà Nẵng', 1, 3, 20000000, 30000000, 4, 1, 'Agile, Scrum, Jira, Confluence', 1, DATEADD(DAY, 45, GETUTCDATE()), 3, 50, GETUTCDATE(), GETUTCDATE()),
(3, 3, 4, 'QA Automation Engineer', 'Tự động hóa testing cho web/mobile', 'Selenium, Cypress, Appium, CI/CD', '2 năm Automation, JavaScript/Python', 'Lương 12-20 triệu, certification support', 'Đà Nẵng', 1, 2, 12000000, 20000000, 4, 1, 'Selenium, Cypress, Appium, Jenkins', 1, DATEADD(DAY, 30, GETUTCDATE()), 3, 40, GETUTCDATE(), GETUTCDATE());
GO

-- 7. Insert Resumes (10 resumes for 6 candidates - some have multiple)
INSERT INTO Resumes (UserId, Title, Summary, FileUrl, CurrentPosition, CurrentCompany, ExpectedSalary, PreferredLocation, PreferredJobType, IsDefault, IsPublic, CreatedAt) VALUES
(5, 'Senior .NET Developer', '3 năm kinh nghiệm .NET Core, Azure, Microservices', 'https://example.com/resumes/cv1.pdf', 'Senior .NET Developer', 'ABC Tech', 25000000, 'Hà Nội', 1, 1, 1, GETUTCDATE()),
(5, 'Fullstack Developer Profile', 'Fullstack React + .NET, đam mê clean code', 'https://example.com/resumes/cv1_alt.pdf', 'Senior .NET Developer', 'ABC Tech', 25000000, 'Hà Nội', 1, 0, 1, GETUTCDATE()),
(6, 'Frontend Specialist (React)', 'Chuyên React, Next.js, TypeScript, Testing', 'https://example.com/resumes/cv2.pdf', 'Frontend Developer', 'WebTech', 22000000, 'TP.HCM', 1, 1, 1, GETUTCDATE()),
(7, 'Java Backend Engineer', 'Spring Boot, Kafka, Microservices, Clean Architecture', 'https://example.com/resumes/cv3.pdf', 'Java Developer', 'FinTech Co', 28000000, 'TP.HCM', 1, 1, 1, GETUTCDATE()),
(8, 'Fullstack Developer', 'React, Node.js, PostgreSQL, AWS', 'https://example.com/resumes/cv4.pdf', 'Fullstack Dev', 'StartupXYZ', 20000000, 'Hải Phòng', 1, 1, 1, GETUTCDATE()),
(9, 'DevOps Engineer', 'AWS, Terraform, Kubernetes, CI/CD, Monitoring', 'https://example.com/resumes/cv5.pdf', 'DevOps Engineer', 'CloudOps', 30000000, 'Hà Nội', 1, 1, 1, GETUTCDATE()),
(10, 'Flutter Mobile Developer', 'Flutter, Dart, Firebase, Clean Architecture', 'https://example.com/resumes/cv6.pdf', 'Mobile Developer', 'AppStudio', 18000000, 'TP.HCM', 5, 1, 1, GETUTCDATE()),
(6, 'React Native Profile', 'React Native, Expo, TypeScript', 'https://example.com/resumes/cv2_rn.pdf', 'Frontend Developer', 'WebTech', 22000000, 'TP.HCM', 5, 0, 0, GETUTCDATE()),
(7, 'Microservices Architect Profile', 'System Design, Domain-Driven Design', 'https://example.com/resumes/cv3_arch.pdf', 'Java Developer', 'FinTech Co', 35000000, 'TP.HCM', 1, 0, 0, GETUTCDATE()),
(8, 'Backend Focused Profile', 'Node.js, Go, PostgreSQL, Redis', 'https://example.com/resumes/cv4_back.pdf', 'Fullstack Dev', 'StartupXYZ', 22000000, 'Hải Phòng', 1, 0, 0, GETUTCDATE());
GO

-- 8. Insert Educations (2-3 per resume = ~20 total, but we limit to 10 per table requirement)
INSERT INTO Educations (ResumeId, Institution, Degree, FieldOfStudy, StartDate, EndDate, IsCurrentlyStudying, Description, GPA, CreatedAt) VALUES
(1, 'Đại học Bách Khoa Hà Nội', 'Kỹ sư', 'Khoa học máy tính', '2013-09-01', '2017-06-01', 0, 'Xếp loại Giỏi', 3.8, GETUTCDATE()),
(1, 'Coursera', 'Chứng chỉ', 'Cloud Architecture', '2020-01-01', '2020-06-01', 0, 'AWS Solutions Architect', NULL, GETUTCDATE()),
(2, 'Đại học Bách Khoa Hà Nội', 'Kỹ sư', 'Khoa học máy tính', '2013-09-01', '2017-06-01', 0, 'Xếp loại Giỏi', 3.8, GETUTCDATE()),
(3, 'Đại học Công nghệ TP.HCM', 'Kỹ sư', 'Công nghệ thông tin', '2014-09-01', '2018-06-01', 0, 'Xếp loại Khá', 3.5, GETUTCDATE()),
(4, 'Đại học Quốc gia TP.HCM', 'Kỹ sư', 'Khoa học máy tính', '2012-09-01', '2016-06-01', 0, 'Xếp loại Xuất sắc', 3.9, GETUTCDATE()),
(5, 'Đại học Đà Nẵng', 'Kỹ sư', 'Kỹ thuật phần mềm', '2015-09-01', '2019-06-01', 0, 'Xếp loại Giỏi', 3.7, GETUTCDATE()),
(6, 'Đại học Bách Khoa Hà Nội', 'Kỹ sư', 'Hệ thống thông tin', '2011-09-01', '2015-06-01', 0, 'Xếp loại Khá', 3.4, GETUTCDATE()),
(7, 'Đại học FPT', 'Kỹ sư', 'Công nghệ phần mềm', '2016-09-01', '2020-06-01', 0, 'Xếp loại Giỏi', 3.6, GETUTCDATE()),
(8, 'Đại học Công nghệ TP.HCM', 'Kỹ sư', 'Công nghệ thông tin', '2014-09-01', '2018-06-01', 0, 'Xếp loại Khá', 3.5, GETUTCDATE()),
(9, 'Đại học Quốc gia TP.HCM', 'Kỹ sư', 'Khoa học máy tính', '2012-09-01', '2016-06-01', 0, 'Xếp loại Xuất sắc', 3.9, GETUTCDATE());
GO

-- 9. Insert WorkExperiences
INSERT INTO WorkExperiences (ResumeId, Company, Position, Location, StartDate, EndDate, IsCurrentJob, Description, CreatedAt) VALUES
(1, 'ABC Technology', 'Senior .NET Developer', 'Hà Nội', '2020-01-01', NULL, 1, 'Lead team 5 devs, thiết kế microservices, CI/CD', GETUTCDATE()),
(1, 'Software Outsourcing Co', '.NET Developer', 'Hà Nội', '2017-07-01', '2019-12-31', 0, 'Phát triển web ASP.NET MVC, WebAPI', GETUTCDATE()),
(2, 'ABC Technology', 'Senior .NET Developer', 'Hà Nội', '2020-01-01', NULL, 1, 'Lead team 5 devs, thiết kế microservices', GETUTCDATE()),
(3, 'WebTech Solutions', 'Frontend Developer', 'TP.HCM', '2019-01-01', NULL, 1, 'React, Next.js, TypeScript, Unit Testing', GETUTCDATE()),
(3, 'Digital Agency', 'Junior Frontend', 'TP.HCM', '2018-06-01', '2018-12-31', 0, 'HTML/CSS/JS, jQuery, Vue.js', GETUTCDATE()),
(4, 'FinTech Corporation', 'Java Developer', 'TP.HCM', '2018-01-01', NULL, 1, 'Spring Boot, Kafka, Redis, Microservices', GETUTCDATE()),
(4, 'Banking Software', 'Junior Java Dev', 'TP.HCM', '2016-07-01', '2017-12-31', 0, 'Java EE, Oracle, Hibernate', GETUTCDATE()),
(5, 'StartupXYZ', 'Fullstack Developer', 'Hải Phòng', '2020-03-01', NULL, 1, 'React, Node.js, PostgreSQL, AWS', GETUTCDATE()),
(6, 'CloudOps Vietnam', 'DevOps Engineer', 'Hà Nội', '2019-01-01', NULL, 1, 'AWS, Terraform, K8s, Prometheus, Grafana', GETUTCDATE()),
(7, 'AppStudio', 'Flutter Developer', 'TP.HCM', '2021-01-01', NULL, 1, 'Flutter, Dart, Firebase, Clean Architecture', GETUTCDATE());
GO

-- 10. Insert ResumeSkills
INSERT INTO ResumeSkills (ResumeId, SkillName, Level, YearsOfExperience, CreatedAt) VALUES
(1, 'C#', 4, 5, GETUTCDATE()),
(1, '.NET Core', 4, 4, GETUTCDATE()),
(1, 'SQL Server', 3, 5, GETUTCDATE()),
(1, 'Azure', 3, 3, GETUTCDATE()),
(1, 'Docker', 3, 3, GETUTCDATE()),
(2, 'C#', 4, 5, GETUTCDATE()),
(2, 'React', 3, 2, GETUTCDATE()),
(3, 'React', 4, 4, GETUTCDATE()),
(3, 'TypeScript', 4, 3, GETUTCDATE()),
(3, 'Next.js', 3, 2, GETUTCDATE()),
(4, 'Java', 4, 5, GETUTCDATE()),
(4, 'Spring Boot', 4, 4, GETUTCDATE()),
(4, 'Kafka', 3, 3, GETUTCDATE()),
(5, 'React', 3, 3, GETUTCDATE()),
(5, 'Node.js', 3, 3, GETUTCDATE()),
(6, 'AWS', 4, 4, GETUTCDATE()),
(6, 'Terraform', 3, 3, GETUTCDATE()),
(6, 'Kubernetes', 3, 3, GETUTCDATE()),
(7, 'Flutter', 4, 3, GETUTCDATE()),
(7, 'Dart', 4, 3, GETUTCDATE());
GO

-- 11. Insert Certificates
INSERT INTO Certificates (ResumeId, Name, IssuingOrganization, IssueDate, ExpiryDate, CredentialId, CredentialUrl, CreatedAt) VALUES
(1, 'AWS Certified Solutions Architect', 'Amazon Web Services', '2021-03-15', '2024-03-15', 'AWS-SAA-123456', 'https://aws.amazon.com/verification', GETUTCDATE()),
(1, 'Microsoft Certified: Azure Developer', 'Microsoft', '2020-06-20', '2023-06-20', 'AZ-204-789012', 'https://learn.microsoft.com/verification', GETUTCDATE()),
(3, 'Professional Scrum Master I', 'Scrum.org', '2021-09-10', NULL, 'PSM-345678', 'https://scrum.org/certificates', GETUTCDATE()),
(4, 'Oracle Certified Professional Java SE 11', 'Oracle', '2019-11-05', NULL, 'OCP-11-567890', 'https://oracle.com/certification', GETUTCDATE()),
(5, 'Certified Kubernetes Administrator', 'CNCF', '2022-02-28', '2025-02-28', 'CKA-901234', 'https://cncf.io/certification', GETUTCDATE()),
(6, 'HashiCorp Certified: Terraform Associate', 'HashiCorp', '2021-07-12', '2024-07-12', 'TF-567890', 'https://hashicorp.com/certification', GETUTCDATE()),
(7, 'Google Associate Android Developer', 'Google', '2022-04-18', '2025-04-18', 'AAD-123789', 'https://developers.google.com/certification', GETUTCDATE()),
(8, 'AWS Certified Developer', 'Amazon Web Services', '2022-08-30', '2025-08-30', 'AWS-DEV-456123', 'https://aws.amazon.com/verification', GETUTCDATE()),
(9, 'CKAD - Certified Kubernetes App Developer', 'CNCF', '2023-01-15', '2026-01-15', 'CKAD-789456', 'https://cncf.io/certification', GETUTCDATE()),
(10, 'MongoDB Certified Developer', 'MongoDB', '2021-12-01', '2024-12-01', 'MDB-345123', 'https://mongodb.com/certification', GETUTCDATE());
GO

-- 12. Insert Languages
INSERT INTO Languages (ResumeId, Name, Proficiency, CreatedAt) VALUES
(1, 'Tiếng Việt', 4, GETUTCDATE()),
(1, 'Tiếng Anh', 3, GETUTCDATE()),
(2, 'Tiếng Việt', 4, GETUTCDATE()),
(2, 'Tiếng Anh', 3, GETUTCDATE()),
(3, 'Tiếng Việt', 4, GETUTCDATE()),
(3, 'Tiếng Anh', 3, GETUTCDATE()),
(4, 'Tiếng Việt', 4, GETUTCDATE()),
(4, 'Tiếng Anh', 3, GETUTCDATE()),
(5, 'Tiếng Việt', 4, GETUTCDATE()),
(5, 'Tiếng Anh', 2, GETUTCDATE()),
(6, 'Tiếng Việt', 4, GETUTCDATE()),
(6, 'Tiếng Anh', 3, GETUTCDATE()),
(7, 'Tiếng Việt', 4, GETUTCDATE()),
(7, 'Tiếng Anh', 3, GETUTCDATE()),
(8, 'Tiếng Việt', 4, GETUTCDATE()),
(8, 'Tiếng Anh', 2, GETUTCDATE()),
(9, 'Tiếng Việt', 4, GETUTCDATE()),
(9, 'Tiếng Anh', 3, GETUTCDATE()),
(10, 'Tiếng Việt', 4, GETUTCDATE()),
(10, 'Tiếng Anh', 3, GETUTCDATE());
GO

-- 13. Insert Applications (10 applications from 6 candidates to various jobs)
INSERT INTO Applications (JobId, UserId, ResumeId, CoverLetter, Status, AppliedAt, ReviewedAt, ReviewedByUserId, RejectionReason, Notes, CreatedAt) VALUES
(1, 5, 1, 'Tôi rất quan tâm vị trí này...', 3, DATEADD(DAY, -5, GETUTCDATE()), DATEADD(DAY, -2, GETUTCDATE()), 2, NULL, 'Phù hợp, mời phỏng vấn', GETUTCDATE()),
(2, 5, 2, 'Với kinh nghiệm .NET Core...', 2, DATEADD(DAY, -3, GETUTCDATE()), NULL, NULL, NULL, 'Đang xem xét', GETUTCDATE()),
(3, 6, 3, 'Tôi có kinh nghiệm React...', 4, DATEADD(DAY, -7, GETUTCDATE()), DATEADD(DAY, -4, GETUTCDATE()), 2, NULL, 'Đã phỏng vòng 1', GETUTCDATE()),
(4, 7, 4, 'Kinh nghiệm Java Spring Boot...', 3, DATEADD(DAY, -10, GETUTCDATE()), DATEADD(DAY, -5, GETUTCDATE()), 3, NULL, 'Mời phỏng vấn kỹ thuật', GETUTCDATE()),
(5, 7, 9, 'Đam mê Machine Learning...', 1, DATEADD(DAY, -2, GETUTCDATE()), NULL, NULL, NULL, 'Mới nộp', GETUTCDATE()),
(6, 8, 5, 'Kinh nghiệm DevOps, AWS...', 3, DATEADD(DAY, -8, GETUTCDATE()), DATEADD(DAY, -3, GETUTCDATE()), 3, NULL, 'Đang chờ phản hồi', GETUTCDATE()),
(7, 10, 7, 'React Native developer...', 2, DATEADD(DAY, -4, GETUTCDATE()), NULL, NULL, NULL, 'Xem xét CV', GETUTCDATE()),
(8, 8, 10, 'Go, Microservices experience...', 1, DATEADD(DAY, -1, GETUTCDATE()), NULL, NULL, NULL, 'Mới nộp', GETUTCDATE()),
(9, 9, 6, 'PM với background kỹ thuật...', 5, DATEADD(DAY, -12, GETUTCDATE()), DATEADD(DAY, -6, GETUTCDATE()), 4, NULL, 'Đã phỏng vấn HR', GETUTCDATE()),
(10, 6, 8, 'QA Automation, Cypress...', 3, DATEADD(DAY, -6, GETUTCDATE()), DATEADD(DAY, -3, GETUTCDATE()), 4, NULL, 'Mời test thực hành', GETUTCDATE());
GO

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify data was inserted correctly:

/*
SELECT 'Users' as TableName, COUNT(*) as Count FROM Users
UNION ALL SELECT 'Roles', COUNT(*) FROM Roles
UNION ALL SELECT 'UserRoles', COUNT(*) FROM UserRoles
UNION ALL SELECT 'Companies', COUNT(*) FROM Companies
UNION ALL SELECT 'Categories', COUNT(*) FROM Categories
UNION ALL SELECT 'Jobs', COUNT(*) FROM Jobs
UNION ALL SELECT 'Resumes', COUNT(*) FROM Resumes
UNION ALL SELECT 'Educations', COUNT(*) FROM Educations
UNION ALL SELECT 'WorkExperiences', COUNT(*) FROM WorkExperiences
UNION ALL SELECT 'ResumeSkills', COUNT(*) FROM ResumeSkills
UNION ALL SELECT 'Certificates', COUNT(*) FROM Certificates
UNION ALL SELECT 'Languages', COUNT(*) FROM Languages
UNION ALL SELECT 'Applications', COUNT(*) FROM Applications;
*/

-- ============================================================================
-- USEFUL VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Active jobs with company and category info
CREATE VIEW vw_ActiveJobs AS
SELECT 
    j.Id, j.Title, j.ShortDescription, j.Location, j.JobType, j.ExperienceLevel,
    j.SalaryMin, j.SalaryMax, j.SalaryType, j.IsNegotiableSalary,
    j.ExpiredDate, j.Status, j.ViewCount, j.CreatedAt, j.PublishedAt,
    c.Name as CompanyName, c.LogoUrl, c.Location as CompanyLocation,
    cat.Name as CategoryName, cat.Icon as CategoryIcon
FROM Jobs j
INNER JOIN Companies c ON j.CompanyId = c.Id
INNER JOIN Categories cat ON j.CategoryId = cat.Id
WHERE j.Status = 3 AND c.IsActive = 1 AND cat.IsActive = 1
  AND (j.ExpiredDate IS NULL OR j.ExpiredDate > GETUTCDATE());
GO

-- View: Candidate profiles with resume count
CREATE VIEW vw_CandidateProfiles AS
SELECT 
    u.Id, u.FullName, u.Email, u.PhoneNumber, u.AvatarUrl, u.Address,
    u.CreatedAt,
    COUNT(DISTINCT r.Id) as ResumeCount,
    COUNT(DISTINCT CASE WHEN r.IsDefault = 1 THEN r.Id END) as DefaultResumeCount
FROM Users u
INNER JOIN UserRoles ur ON u.Id = ur.UserId
INNER JOIN Roles ro ON ur.RoleId = ro.Id
LEFT JOIN Resumes r ON u.Id = r.UserId
WHERE ro.Name = 'Candidate' AND u.IsActive = 1
GROUP BY u.Id, u.FullName, u.Email, u.PhoneNumber, u.AvatarUrl, u.Address, u.CreatedAt;
GO

-- View: Employer companies with job count
CREATE VIEW vw_EmployerCompanies AS
SELECT 
    c.Id, c.Name, c.Description, c.LogoUrl, c.Industry, c.Size, c.Location,
    c.IsVerified, c.IsActive, c.CreatedAt,
    u.Email as ContactEmail, u.FullName as ContactName, u.PhoneNumber as ContactPhone,
    COUNT(DISTINCT j.Id) as TotalJobs,
    COUNT(DISTINCT CASE WHEN j.Status = 3 THEN j.Id END) as ActiveJobs
FROM Companies c
INNER JOIN Users u ON c.UserId = u.Id
LEFT JOIN Jobs j ON c.Id = j.CompanyId
WHERE c.IsActive = 1
GROUP BY c.Id, c.Name, c.Description, c.LogoUrl, c.Industry, c.Size, c.Location,
         c.IsVerified, c.IsActive, c.CreatedAt,
         u.Email, u.FullName, u.PhoneNumber;
GO

PRINT 'Database schema and sample data created successfully!';
PRINT 'Total tables: 17';
PRINT 'Sample records: 10 per table (where applicable)';
