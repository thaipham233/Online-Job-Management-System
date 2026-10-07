using FluentAssertions;
using Online_Job_Management_System.DTOs.Company;
using Online_Job_Management_System.Validators.Company;
using Xunit;

namespace Online_Job_Management_System.Tests.Validators.Company
{
    public class CreateCompanyDtoValidatorTests
    {
        private readonly CreateCompanyDtoValidator _validator;

        public CreateCompanyDtoValidatorTests()
        {
            _validator = new CreateCompanyDtoValidator();
        }

        [Fact]
        public void ValidCreateCompanyDto_ShouldPassValidation()
        {
            // Arrange
            var dto = new CreateCompanyDto
            {
                Name = "Test Company",
                Description = "A test company",
                Website = "https://testcompany.com",
                Location = "Hanoi",
                LogoUrl = "https://testcompany.com/logo.png",
                CoverImageUrl = "https://testcompany.com/cover.jpg",
                Size = 100,
                Industry = "Technology"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeTrue();
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void MissingName_ShouldFailValidation(string name)
        {
            // Arrange
            var dto = new CreateCompanyDto { Name = name };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Company name is required"));
        }

        [Fact]
        public void NameTooLong_ShouldFailValidation()
        {
            // Arrange
            var dto = new CreateCompanyDto { Name = new string('a', 201) };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("must not exceed 200 characters"));
        }

        [Theory]
        [InlineData("not-a-url")]
        [InlineData("just-text")]
        public void InvalidWebsiteUrl_ShouldFailValidation(string url)
        {
            // Arrange
            var dto = new CreateCompanyDto
            {
                Name = "Test Company",
                Website = url
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Invalid website URL format"));
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void EmptyWebsiteUrl_ShouldPassValidation(string url)
        {
            // Arrange - Website is optional, so empty/null should pass
            var dto = new CreateCompanyDto
            {
                Name = "Test Company",
                Website = url
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeTrue();
        }

        [Fact]
        public void ValidWebsiteUrl_ShouldPassValidation()
        {
            // Arrange
            var dto = new CreateCompanyDto
            {
                Name = "Test Company",
                Website = "https://example.com"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeTrue();
        }

        [Fact]
        public void InvalidSize_ShouldFailValidation()
        {
            // Arrange
            var dto = new CreateCompanyDto
            {
                Name = "Test Company",
                Size = 0
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Company size must be greater than 0"));
        }
    }
}
