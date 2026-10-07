using FluentValidation;
using Online_Job_Management_System.DTOs.Resume;

namespace Online_Job_Management_System.Validators.Resume
{
    public class CreateResumeDtoValidator : AbstractValidator<CreateResumeDto>
    {
        public CreateResumeDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Resume title is required")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

            RuleFor(x => x.Summary)
                .MaximumLength(1000).WithMessage("Summary must not exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Summary));

            RuleFor(x => x.FileUrl)
                .Must(BeValidUrl).WithMessage("Invalid file URL format")
                .When(x => !string.IsNullOrEmpty(x.FileUrl));

            RuleFor(x => x.CurrentPosition)
                .MaximumLength(100).WithMessage("Current position must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.CurrentPosition));

            RuleFor(x => x.CurrentCompany)
                .MaximumLength(200).WithMessage("Current company must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.CurrentCompany));

            RuleFor(x => x.ExpectedSalary)
                .GreaterThanOrEqualTo(0).WithMessage("Expected salary must be >= 0")
                .When(x => x.ExpectedSalary.HasValue);

            RuleFor(x => x.PreferredLocation)
                .MaximumLength(100).WithMessage("Preferred location must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.PreferredLocation));

            RuleFor(x => x.PreferredJobType)
                .IsInEnum().WithMessage("Invalid job type")
                .When(x => x.PreferredJobType.HasValue);

            RuleForEach(x => x.Educations).SetValidator(new CreateEducationDtoValidator());
            RuleForEach(x => x.WorkExperiences).SetValidator(new CreateWorkExperienceDtoValidator());
            RuleForEach(x => x.Skills).SetValidator(new CreateResumeSkillDtoValidator());
            RuleForEach(x => x.Certificates).SetValidator(new CreateCertificateDtoValidator());
            RuleForEach(x => x.Languages).SetValidator(new CreateLanguageDtoValidator());
        }

        private bool BeValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }
    }

    public class UpdateResumeDtoValidator : AbstractValidator<UpdateResumeDto>
    {
        public UpdateResumeDtoValidator()
        {
            RuleFor(x => x.Title)
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Title));

            RuleFor(x => x.Summary)
                .MaximumLength(1000).WithMessage("Summary must not exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Summary));

            RuleFor(x => x.FileUrl)
                .Must(BeValidUrl).WithMessage("Invalid file URL format")
                .When(x => !string.IsNullOrEmpty(x.FileUrl));

            RuleFor(x => x.CurrentPosition)
                .MaximumLength(100).WithMessage("Current position must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.CurrentPosition));

            RuleFor(x => x.CurrentCompany)
                .MaximumLength(200).WithMessage("Current company must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.CurrentCompany));

            RuleFor(x => x.ExpectedSalary)
                .GreaterThanOrEqualTo(0).WithMessage("Expected salary must be >= 0")
                .When(x => x.ExpectedSalary.HasValue);

            RuleFor(x => x.PreferredLocation)
                .MaximumLength(100).WithMessage("Preferred location must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.PreferredLocation));

            RuleFor(x => x.PreferredJobType)
                .IsInEnum().WithMessage("Invalid job type")
                .When(x => x.PreferredJobType.HasValue);
        }

        private bool BeValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }
    }

    public class CreateEducationDtoValidator : AbstractValidator<CreateEducationDto>
    {
        public CreateEducationDtoValidator()
        {
            RuleFor(x => x.Institution)
                .NotEmpty().WithMessage("Institution is required")
                .MaximumLength(200).WithMessage("Institution must not exceed 200 characters");

            RuleFor(x => x.Degree)
                .NotEmpty().WithMessage("Degree is required")
                .MaximumLength(200).WithMessage("Degree must not exceed 200 characters");

            RuleFor(x => x.FieldOfStudy)
                .MaximumLength(200).WithMessage("Field of study must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.FieldOfStudy));

            RuleFor(x => x.EndDate)
                .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be >= Start date")
                .When(x => x.StartDate.HasValue && x.EndDate.HasValue && !x.IsCurrentlyStudying);

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));

            RuleFor(x => x.GPA)
                .InclusiveBetween(0, 4).WithMessage("GPA must be between 0 and 4")
                .When(x => x.GPA.HasValue);
        }
    }

    public class CreateWorkExperienceDtoValidator : AbstractValidator<CreateWorkExperienceDto>
    {
        public CreateWorkExperienceDtoValidator()
        {
            RuleFor(x => x.Company)
                .NotEmpty().WithMessage("Company is required")
                .MaximumLength(200).WithMessage("Company must not exceed 200 characters");

            RuleFor(x => x.Position)
                .NotEmpty().WithMessage("Position is required")
                .MaximumLength(200).WithMessage("Position must not exceed 200 characters");

            RuleFor(x => x.Location)
                .MaximumLength(200).WithMessage("Location must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Location));

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Start date is required")
                .LessThanOrEqualTo(DateTime.Now).WithMessage("Start date cannot be in the future");

            RuleFor(x => x.EndDate)
                .GreaterThanOrEqualTo(x => x.StartDate).WithMessage("End date must be >= Start date")
                .When(x => x.EndDate.HasValue && !x.IsCurrentJob);

            RuleFor(x => x.Description)
                .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters")
                .When(x => !string.IsNullOrEmpty(x.Description));
        }
    }

    public class CreateResumeSkillDtoValidator : AbstractValidator<CreateResumeSkillDto>
    {
        public CreateResumeSkillDtoValidator()
        {
            RuleFor(x => x.SkillName)
                .NotEmpty().WithMessage("Skill name is required")
                .MaximumLength(100).WithMessage("Skill name must not exceed 100 characters");

            RuleFor(x => x.Level)
                .IsInEnum().WithMessage("Invalid skill level");

            RuleFor(x => x.YearsOfExperience)
                .GreaterThanOrEqualTo(0).WithMessage("Years of experience must be >= 0");
        }
    }

    public class CreateCertificateDtoValidator : AbstractValidator<CreateCertificateDto>
    {
        public CreateCertificateDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Certificate name is required")
                .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

            RuleFor(x => x.IssuingOrganization)
                .MaximumLength(200).WithMessage("Issuing organization must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.IssuingOrganization));

            RuleFor(x => x.ExpiryDate)
                .GreaterThanOrEqualTo(x => x.IssueDate).WithMessage("Expiry date must be >= Issue date")
                .When(x => x.IssueDate.HasValue && x.ExpiryDate.HasValue);

            RuleFor(x => x.CredentialId)
                .MaximumLength(500).WithMessage("Credential ID must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.CredentialId));

            RuleFor(x => x.CredentialUrl)
                .Must(BeValidUrl).WithMessage("Invalid credential URL format")
                .When(x => !string.IsNullOrEmpty(x.CredentialUrl));
        }

        private bool BeValidUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return true;
            return Uri.TryCreate(url, UriKind.Absolute, out _);
        }
    }

    public class CreateLanguageDtoValidator : AbstractValidator<CreateLanguageDto>
    {
        public CreateLanguageDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Language name is required")
                .MaximumLength(50).WithMessage("Language name must not exceed 50 characters");

            RuleFor(x => x.Proficiency)
                .IsInEnum().WithMessage("Invalid proficiency level");
        }
    }
}
