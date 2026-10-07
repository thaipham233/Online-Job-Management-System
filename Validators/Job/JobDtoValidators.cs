using FluentValidation;
using Online_Job_Management_System.DTOs.Job;

namespace Online_Job_Management_System.Validators.Job
{
    public class CreateJobDtoValidator : AbstractValidator<CreateJobDto>
    {
        public CreateJobDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Job title is required")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

            RuleFor(x => x.ShortDescription)
                .MaximumLength(500).WithMessage("Short description must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.ShortDescription));

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required");

            RuleFor(x => x.Requirements)
                .NotEmpty().WithMessage("Requirements are required");

            RuleFor(x => x.Benefits)
                .NotEmpty().WithMessage("Benefits are required");

            RuleFor(x => x.Location)
                .MaximumLength(100).WithMessage("Location must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.Location));

            RuleFor(x => x.JobType)
                .IsInEnum().WithMessage("Invalid job type");

            RuleFor(x => x.ExperienceLevel)
                .IsInEnum().WithMessage("Invalid experience level");

            RuleFor(x => x.SalaryMin)
                .GreaterThanOrEqualTo(0).WithMessage("Minimum salary must be >= 0")
                .When(x => x.SalaryMin.HasValue);

            RuleFor(x => x.SalaryMax)
                .GreaterThanOrEqualTo(0).WithMessage("Maximum salary must be >= 0")
                .When(x => x.SalaryMax.HasValue);

            RuleFor(x => x.SalaryType)
                .IsInEnum().WithMessage("Invalid salary type");

            RuleFor(x => x.Skills)
                .MaximumLength(200).WithMessage("Skills must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Skills));

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0");

            RuleFor(x => x.ExpiredDate)
                .GreaterThan(DateTime.Now).WithMessage("Expiry date must be in the future")
                .When(x => x.ExpiredDate.HasValue);

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Category is required");
        }
    }

    public class UpdateJobDtoValidator : AbstractValidator<UpdateJobDto>
    {
        public UpdateJobDtoValidator()
        {
            RuleFor(x => x.Title)
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Title));

            RuleFor(x => x.ShortDescription)
                .MaximumLength(500).WithMessage("Short description must not exceed 500 characters")
                .When(x => !string.IsNullOrEmpty(x.ShortDescription));

            RuleFor(x => x.Location)
                .MaximumLength(100).WithMessage("Location must not exceed 100 characters")
                .When(x => !string.IsNullOrEmpty(x.Location));

            RuleFor(x => x.JobType)
                .IsInEnum().WithMessage("Invalid job type")
                .When(x => x.JobType.HasValue);

            RuleFor(x => x.ExperienceLevel)
                .IsInEnum().WithMessage("Invalid experience level")
                .When(x => x.ExperienceLevel.HasValue);

            RuleFor(x => x.SalaryMin)
                .GreaterThanOrEqualTo(0).WithMessage("Minimum salary must be >= 0")
                .When(x => x.SalaryMin.HasValue);

            RuleFor(x => x.SalaryMax)
                .GreaterThanOrEqualTo(0).WithMessage("Maximum salary must be >= 0")
                .When(x => x.SalaryMax.HasValue);

            RuleFor(x => x.SalaryType)
                .IsInEnum().WithMessage("Invalid salary type")
                .When(x => x.SalaryType.HasValue);

            RuleFor(x => x.Skills)
                .MaximumLength(200).WithMessage("Skills must not exceed 200 characters")
                .When(x => !string.IsNullOrEmpty(x.Skills));

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0")
                .When(x => x.Quantity.HasValue);

            RuleFor(x => x.ExpiredDate)
                .GreaterThan(DateTime.Now).WithMessage("Expiry date must be in the future")
                .When(x => x.ExpiredDate.HasValue);

            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid job status")
                .When(x => x.Status.HasValue);
        }
    }

    public class JobSearchDtoValidator : AbstractValidator<JobSearchDto>
    {
        public JobSearchDtoValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Page size must not exceed 100");

            RuleFor(x => x.SortDirection)
                .Must(d => d == "asc" || d == "desc").WithMessage("Sort direction must be 'asc' or 'desc'")
                .When(x => !string.IsNullOrEmpty(x.SortDirection));
        }
    }

    public class JobStatusUpdateDtoValidator : AbstractValidator<JobStatusUpdateDto>
    {
        public JobStatusUpdateDtoValidator()
        {
            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid job status");
        }
    }
}
