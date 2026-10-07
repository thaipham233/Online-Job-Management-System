using FluentAssertions;
using Online_Job_Management_System.DTOs.Application;
using Online_Job_Management_System.Models;
using Online_Job_Management_System.Validators.Application;
using Xunit;

namespace Online_Job_Management_System.Tests.Validators.Application
{
    public class ApplicationDtoValidatorTests
    {
        private readonly CreateApplicationDtoValidator _createValidator;
        private readonly UpdateApplicationStatusDtoValidator _updateValidator;

        public ApplicationDtoValidatorTests()
        {
            _createValidator = new CreateApplicationDtoValidator();
            _updateValidator = new UpdateApplicationStatusDtoValidator();
        }

        [Fact]
        public void ValidCreateApplicationDto_ShouldPassValidation()
        {
            var dto = new CreateApplicationDto
            {
                JobId = 1,
                CoverLetter = "I am interested in this position",
                ResumeId = 1
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }

        [Fact]
        public void MissingJobId_ShouldFailValidation()
        {
            var dto = new CreateApplicationDto
            {
                JobId = 0,
                CoverLetter = "Test"
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Job is required") || e.ErrorMessage.Contains("Job"));
        }

        [Fact]
        public void ValidUpdateApplicationStatusDto_ShouldPassValidation()
        {
            var dto = new UpdateApplicationStatusDto
            {
                Status = (ApplicationStatus)1 // Valid enum value
            };

            var result = _updateValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }

        [Fact]
        public void ValidUpdateApplicationStatusDto_WithRejectionReason_ShouldPassValidation()
        {
            var dto = new UpdateApplicationStatusDto
            {
                Status = (ApplicationStatus)1,
                RejectionReason = "Not qualified",
                Notes = "Interview feedback"
            };

            var result = _updateValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }
    }
}
