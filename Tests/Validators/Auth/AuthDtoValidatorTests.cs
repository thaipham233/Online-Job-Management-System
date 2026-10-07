using FluentAssertions;
using Online_Job_Management_System.DTOs.Auth;
using Online_Job_Management_System.Validators.Auth;
using Xunit;

namespace Online_Job_Management_System.Tests.Validators.Auth
{
    public class RegisterDtoValidatorTests
    {
        private readonly RegisterDtoValidator _validator;

        public RegisterDtoValidatorTests()
        {
            _validator = new RegisterDtoValidator();
        }

        [Fact]
        public void ValidRegisterDto_ShouldPassValidation()
        {
            // Arrange
            var dto = new RegisterDto
            {
                Email = "test@example.com",
                UserName = "testuser",
                Password = "Test@123",
                ConfirmPassword = "Test@123",
                FullName = "Test User",
                PhoneNumber = "0901234567",
                Role = "Candidate"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeTrue();
            result.Errors.Should().BeEmpty();
        }

        [Theory]
        [InlineData("", "Email is required")]
        [InlineData("invalid-email", "Invalid email format")]
        [InlineData("@nodomain.com", "Invalid email format")]
        [InlineData("noatsign.com", "Invalid email format")]
        public void InvalidEmail_ShouldFailValidation(string email, string expectedMessage)
        {
            // Arrange
            var dto = new RegisterDto
            {
                Email = email,
                UserName = "testuser",
                Password = "Test@123",
                ConfirmPassword = "Test@123",
                FullName = "Test User",
                Role = "Candidate"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains(expectedMessage));
        }

        [Theory]
        [InlineData("short", "Password must be at least 8 characters")]
        [InlineData("nouppercase123!", "Password must contain at least one uppercase letter")]
        [InlineData("NOLOWERCASE123!", "Password must contain at least one lowercase letter")]
        [InlineData("NoDigitsHere!", "Password must contain at least one digit")]
        [InlineData("NoSpecialChar123", "Password must contain at least one special character")]
        public void InvalidPassword_ShouldFailValidation(string password, string expectedMessage)
        {
            // Arrange
            var dto = new RegisterDto
            {
                Email = "test@example.com",
                UserName = "testuser",
                Password = password,
                ConfirmPassword = password,
                FullName = "Test User",
                Role = "Candidate"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains(expectedMessage));
        }

        [Fact]
        public void MismatchedPasswords_ShouldFailValidation()
        {
            // Arrange
            var dto = new RegisterDto
            {
                Email = "test@example.com",
                UserName = "testuser",
                Password = "Test@123",
                ConfirmPassword = "Different@123",
                FullName = "Test User",
                Role = "Candidate"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Passwords do not match"));
        }

        [Theory]
        [InlineData("InvalidRole")]
        [InlineData("")]
        public void InvalidRole_ShouldFailValidation(string role)
        {
            // Arrange
            var dto = new RegisterDto
            {
                Email = "test@example.com",
                UserName = "testuser",
                Password = "Test@123",
                ConfirmPassword = "Test@123",
                FullName = "Test User",
                Role = role
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Role must be either 'Candidate' or 'Employer'"));
        }

        [Fact]
        public void ValidEmployerRole_ShouldPassValidation()
        {
            // Arrange
            var dto = new RegisterDto
            {
                Email = "employer@company.com",
                UserName = "employer",
                Password = "Test@123",
                ConfirmPassword = "Test@123",
                FullName = "Employer User",
                Role = "Employer"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeTrue();
        }
    }

    public class LoginDtoValidatorTests
    {
        private readonly LoginDtoValidator _validator;

        public LoginDtoValidatorTests()
        {
            _validator = new LoginDtoValidator();
        }

        [Fact]
        public void ValidLoginDto_ShouldPassValidation()
        {
            // Arrange
            var dto = new LoginDto
            {
                Email = "test@example.com",
                Password = "Test@123"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeTrue();
        }

        [Fact]
        public void MissingEmail_ShouldFailValidation()
        {
            // Arrange
            var dto = new LoginDto
            {
                Email = "",
                Password = "Test@123"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Email is required"));
        }

        [Fact]
        public void InvalidEmailFormat_ShouldFailValidation()
        {
            // Arrange
            var dto = new LoginDto
            {
                Email = "invalid-email",
                Password = "Test@123"
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Invalid email format"));
        }

        [Fact]
        public void MissingPassword_ShouldFailValidation()
        {
            // Arrange
            var dto = new LoginDto
            {
                Email = "test@example.com",
                Password = ""
            };

            // Act
            var result = _validator.Validate(dto);

            // Assert
            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Password is required"));
        }
    }
}
