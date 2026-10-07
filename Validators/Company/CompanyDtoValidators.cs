using FluentValidation;
using Online_Job_Management_System.DTOs.Company;

namespace Online_Job_Management_System.Validators.Company
{
    public class CreateCompanyDtoValidator : AbstractValidator<CreateCompanyDto>
    {
        public CreateCompanyDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Company name is required")
                .MaximumLength(200).WithMessage("Company name must not exceed 200 characters");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.Website)
                .Must(BeValidUrl).WithMessage("Invalid website URL format")
                .When(x => !string.IsNullOrEmpty(x.Website));

            RuleFor(x => x.Location)
                .MaximumLength(200).WithMessage("Location must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Location));

            RuleFor(x => x.LogoUrl)
                .Must(BeValidUrl).WithMessage("Invalid logo URL format")
                .When(x => !string.IsNullOrEmpty(x.LogoUrl));

            RuleFor(x => x.CoverImageUrl)
                .Must(BeValidUrl).WithMessage("Invalid cover image URL format")
                .When(x => !string.IsNullOrEmpty(x.CoverImageUrl));

            RuleFor(x => x.Size)
                .GreaterThan(0).WithMessage("Company size must be greater than 0")
                .When(x => x.Size.HasValue);

            RuleFor(x => x.Industry)
                .MaximumLength(100).WithMessage("Industry must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.Industry));
        }

        private bool BeValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }
    }

    public class UpdateCompanyDtoValidator : AbstractValidator<UpdateCompanyDto>
    {
        public UpdateCompanyDtoValidator()
        {
            RuleFor(x => x.Name)
                .MaximumLength(200).WithMessage("Company name must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Name));

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.Website)
                .Must(BeValidUrl).WithMessage("Invalid website URL format")
                .When(x => !string.IsNullOrEmpty(x.Website));

            RuleFor(x => x.Location)
                .MaximumLength(200).WithMessage("Location must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Location));

            RuleFor(x => x.LogoUrl)
                .Must(BeValidUrl).WithMessage("Invalid logo URL format")
                .When(x => !string.IsNullOrEmpty(x.LogoUrl));

            RuleFor(x => x.CoverImageUrl)
                .Must(BeValidUrl).WithMessage("Invalid cover image URL format")
                .When(x => !string.IsNullOrEmpty(x.CoverImageUrl));

            RuleFor(x => x.Size)
                .GreaterThan(0).WithMessage("Company size must be greater than 0")
                .When(x => x.Size.HasValue);

            RuleFor(x => x.Industry)
                .MaximumLength(100).WithMessage("Industry must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.Industry));
        }

        private bool BeValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }
    }

    public class CompanySearchDtoValidator : AbstractValidator<CompanySearchDto>
    {
        public CompanySearchDtoValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Page size must not exceed 100");
        }
    }
}
