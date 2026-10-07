using FluentAssertions;
using Online_Job_Management_System.DTOs.Category;
using Online_Job_Management_System.Validators.Category;
using Xunit;

namespace Online_Job_Management_System.Tests.Validators.Category
{
    public class CategoryDtoValidatorTests
    {
        private readonly CreateCategoryDtoValidator _createValidator;
        private readonly UpdateCategoryDtoValidator _updateValidator;

        public CategoryDtoValidatorTests()
        {
            _createValidator = new CreateCategoryDtoValidator();
            _updateValidator = new UpdateCategoryDtoValidator();
        }

        [Fact]
        public void ValidCreateCategoryDto_ShouldPassValidation()
        {
            var dto = new CreateCategoryDto
            {
                Name = "Software Development",
                Description = "Software development jobs"
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void MissingName_ShouldFailValidation(string name)
        {
            var dto = new CreateCategoryDto { Name = name };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("Category name is required"));
        }

        [Fact]
        public void NameTooLong_ShouldFailValidation()
        {
            var dto = new CreateCategoryDto { Name = new string('a', 101) };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("must not exceed 100 characters"));
        }

        [Fact]
        public void DescriptionTooLong_ShouldFailValidation()
        {
            var dto = new CreateCategoryDto
            {
                Name = "Test",
                Description = new string('a', 501)
            };

            var result = _createValidator.Validate(dto);

            result.IsValid.Should().BeFalse();
            result.Errors.Should().Contain(e => e.ErrorMessage.Contains("must not exceed 500 characters"));
        }

        [Fact]
        public void ValidUpdateCategoryDto_ShouldPassValidation()
        {
            var dto = new UpdateCategoryDto
            {
                Name = "Updated Category",
                Description = "Updated description"
            };

            var result = _updateValidator.Validate(dto);

            result.IsValid.Should().BeTrue();
        }
    }
}
