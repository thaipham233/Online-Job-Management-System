using FluentAssertions;
using Online_Job_Management_System.DTOs.Resume;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Validators.Resume;
using Xunit;

namespace Online_Job_Management_System.Tests.Validators.Resume
{
    public class ResumeDtoValidatorTests
    {
        private readonly CreateResumeDtoValidator _createValidator;
        private readonly UpdateResumeDtoValidator _updateValidator;

        public ResumeDtoValidatorTests()
        {
            _createValidator = new CreateResumeDtoValidator();
            _updateValidator = new UpdateResumeDtoValidator();
        }

        [Fact]
        public void ValidCreateResumeDto_ShouldPassValidation()
        {
            var dto = new CreateResumeDto
            {
                Title = "Senior .NET Developer Resume",
                Summary = "Experienced .NET developer with 5+ years experience",
                Skills = new List<CreateResumeSkillDto>
                {
                    new CreateResumeSkillDto { SkillName = "C#", Level = SkillLevel.Advanced, YearsOfExperience = 5 },
                    new CreateResumeSkillDto { SkillName = ".NET Core", Level = SkillLevel.Advanced, YearsOfExperience = 4 },
                    new CreateResumeSkillDto { SkillName = "SQL Server", Level = SkillLevel.Intermediate, YearsOfExperience = 3 }
                },
                Educations = new List<CreateEducationDto>
                {
                    new CreateEducationDto 
                    { 
                        Institution = "Hanoi University", 
                        Degree = "Bachelor of Computer Science",
                        FieldOfStudy = "Software Engineering",
                        StartDate = new DateTime(2015, 9, 1),
                        EndDate = new DateTime(2019, 6, 1)
                    }
                },
                WorkExperiences = new List<CreateWorkExperienceDto>
                {
                    new CreateWorkExperienceDto
                    {
                        Company = "ABC Company",
                        Position = ".NET Developer",
                        StartDate = new DateTime(2019, 7, 1),
                        IsCurrentJob = true,
                        Description = "Developing web applications using .NET Core"
                    }
                },
                Certificates = new List<CreateCertificateDto>
                {
                    new CreateCertificateDto
                    {
                        Name = "Azure Fundamentals",
                        IssuingOrganization = "Microsoft",
                        IssueDate = new DateTime(2022, 1, 15)
                    }
                },
                Languages = new List<CreateLanguageDto>
                {
                    new CreateLanguageDto { Name = "English", Proficiency = LanguageProficiency.Professional },
                    new CreateLanguageDto { Name = "Vietnamese", Proficiency = LanguageProficiency.Native }
                },
                FileUrl = "https://example.com/resume.pdf",
                CurrentPosition = "Senior .NET Developer",
                CurrentCompany = "ABC Company",
                ExpectedSalary = 25000000,
                PreferredLocation = "Hanoi",
                PreferredJobType = JobType.FullTime,
                IsPublic = true
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void MissingTitle_ShouldFailValidation(string title)
        {
            var dto = new CreateResumeDto
            {
                Title = title
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Resume title is required") || e.ErrorMessage.Contains("Title"));
        }

        [Fact]
        public void InvalidFileUrl_ShouldFailValidation()
        {
            var dto = new CreateResumeDto
            {
                Title = "Test Resume",
                FileUrl = "not-a-url"
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Invalid file URL format") || e.ErrorMessage.Contains("URL"));
        }
    }
}
