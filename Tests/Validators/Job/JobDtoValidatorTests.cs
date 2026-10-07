using FluentAssertions;
using Online_Job_Management_System.DTOs.Job;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Validators.Job;
using Xunit;

namespace Online_Job_Management_System.Tests.Validators.Job
{
    public class JobDtoValidatorTests
    {
        private readonly CreateJobDtoValidator _createValidator;
        private readonly UpdateJobDtoValidator _updateValidator;
        private readonly JobSearchDtoValidator _searchValidator;

        public JobDtoValidatorTests()
        {
            _createValidator = new CreateJobDtoValidator();
            _updateValidator = new UpdateJobDtoValidator();
            _searchValidator = new JobSearchDtoValidator();
        }

        [Fact]
        public void ValidCreateJobDto_ShouldPassValidation()
        {
            var dto = new CreateJobDto
            {
                Title = "Senior .NET Developer",
                Description = "We are looking for a senior .NET developer",
                Requirements = "5+ years experience with .NET",
                Benefits = "Competitive salary, health insurance",
                Location = "Hanoi",
                SalaryMin = 15000000,
                SalaryMax = 25000000,
                JobType = JobType.FullTime,
                ExperienceLevel = ExperienceLevel.Senior,
                CategoryId = 1
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void MissingTitle_ShouldFailValidation(string title)
        {
            var dto = new CreateJobDto { Title = title };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Job title is required") || e.ErrorMessage.Contains("Title"));
        }

        [Fact]
        public void MissingDescription_ShouldFailValidation()
        {
            var dto = new CreateJobDto
            {
                Title = "Test Job",
                Description = "",
                Requirements = "Test",
                Benefits = "Test",
                CategoryId = 1
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Description is required"));
        }

        [Fact]
        public void MissingCategoryId_ShouldFailValidation()
        {
            var dto = new CreateJobDto
            {
                Title = "Test Job",
                Description = "Test",
                Requirements = "Test",
                Benefits = "Test",
                CategoryId = 0
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Category is required"));
        }

        [Fact]
        public void ValidJobSearchDto_ShouldPassValidation()
        {
            var dto = new JobSearchDto
            {
                PageNumber = 1,
                PageSize = 10,
                Keyword = "developer",
                Location = "Hanoi",
                JobType = JobType.FullTime,
                ExperienceLevel = ExperienceLevel.Senior,
                CategoryId = 1,
                SalaryMin = 10000000
            };

            var result = _searchValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }

        [Fact]
        public void InvalidPageNumber_ShouldFailValidation()
        {
            var dto = new JobSearchDto
            {
                PageNumber = 0,
                PageSize = 10
            };

            var result = _searchValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Page number must be greater than 0"));
        }

        [Fact]
        public void InvalidPageSize_ShouldFailValidation()
        {
            var dto = new JobSearchDto
            {
                PageNumber = 1,
                PageSize = 101
            };

            var result = _searchValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Page size must not exceed 100"));
        }
    }
}
