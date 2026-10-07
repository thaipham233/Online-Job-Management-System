using FluentValidation;
using Online_Job_Management_System.DTOs.Application;

namespace Online_Job_Management_System.Validators.Application
{
    public class CreateApplicationDtoValidator : AbstractValidator<CreateApplicationDto>
    {
        public CreateApplicationDtoValidator()
        {
            RuleFor(x => x.CoverLetter)
                .MaximumLength(1000).WithMessage("Cover letter must not exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.CoverLetter));

            RuleFor(x => x.JobId)
                .GreaterThan(0).WithMessage("Job is required");

            RuleFor(x => x.ResumeId)
                .GreaterThan(0).WithMessage("Invalid resume ID")
                .When(x => x.ResumeId.HasValue);
        }
    }

    public class UpdateApplicationStatusDtoValidator : AbstractValidator<UpdateApplicationStatusDto>
    {
        public UpdateApplicationStatusDtoValidator()
        {
            RuleFor(x => x.Status)
                .IsInEnum().WithMessage("Invalid application status");

            RuleFor(x => x.RejectionReason)
                .MaximumLength(1000).WithMessage("Rejection reason must not exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.RejectionReason));

            RuleFor(x => x.Notes)
                .MaximumLength(1000).WithMessage("Notes must not exceed 1000 characters")
                .When(x => !string.IsNullOrEmpty(x.Notes));
        }
    }

    public class ApplicationSearchDtoValidator : AbstractValidator<ApplicationSearchDto>
    {
        public ApplicationSearchDtoValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0).WithMessage("Page number must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0).WithMessage("Page size must be greater than 0")
                .LessThanOrEqualTo(100).WithMessage("Page size must not exceed 100");

            RuleFor(x => x.ToDate)
                .GreaterThanOrEqualTo(x => x.FromDate).WithMessage("ToDate must be >= FromDate")
                .When(x => x.FromDate.HasValue && x.ToDate.HasValue);
        }
    }
}
