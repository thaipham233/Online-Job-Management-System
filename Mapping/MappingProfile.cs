using AutoMapper;
using Online_Job_Management_System.DTOs.Auth;
using Online_Job_Management_System.DTOs.Company;
using Online_Job_Management_System.DTOs.Category;
using Online_Job_Management_System.DTOs.Job;
using Online_Job_Management_System.DTOs.Application;
using Online_Job_Management_System.DTOs.Resume;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.Roles, opt => opt.Ignore()); // Set manually

            // Company mappings
            CreateMap<Company, CompanyDto>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.JobsCount, opt => opt.MapFrom(src => src.Jobs?.Count ?? 0));

            CreateMap<CreateCompanyDto, Company>();
            CreateMap<UpdateCompanyDto, Company>();

            // Category mappings
            CreateMap<Category, CategoryDto>()
                .ForMember(dest => dest.SubCategories, opt => opt.MapFrom(src => src.SubCategories))
                .ForMember(dest => dest.JobsCount, opt => opt.MapFrom(src => src.Jobs?.Count ?? 0));

            CreateMap<CreateCategoryDto, Category>();
            CreateMap<UpdateCategoryDto, Category>();

            // Job mappings
            CreateMap<Job, JobDto>()
                .ForMember(dest => dest.Company, opt => opt.MapFrom(src => src.Company))
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category))
                .ForMember(dest => dest.ApplicationsCount, opt => opt.MapFrom(src => src.Applications?.Count ?? 0));

            CreateMap<CreateJobDto, Job>();
            CreateMap<UpdateJobDto, Job>();

            // Application mappings
            CreateMap<Application, ApplicationDto>()
                .ForMember(dest => dest.Job, opt => opt.MapFrom(src => src.Job))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.Resume, opt => opt.MapFrom(src => src.Resume));

            CreateMap<CreateApplicationDto, Application>();

            // Resume mappings
            CreateMap<Resume, ResumeDto>()
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                .ForMember(dest => dest.Educations, opt => opt.MapFrom(src => src.Educations))
                .ForMember(dest => dest.WorkExperiences, opt => opt.MapFrom(src => src.WorkExperiences))
                .ForMember(dest => dest.Skills, opt => opt.MapFrom(src => src.ResumeSkills))
                .ForMember(dest => dest.Certificates, opt => opt.MapFrom(src => src.Certificates))
                .ForMember(dest => dest.Languages, opt => opt.MapFrom(src => src.Languages));

            CreateMap<CreateResumeDto, Resume>();
            CreateMap<UpdateResumeDto, Resume>();

            // Education mappings
            CreateMap<Education, EducationDto>();
            CreateMap<CreateEducationDto, Education>();

            // WorkExperience mappings
            CreateMap<WorkExperience, WorkExperienceDto>();
            CreateMap<CreateWorkExperienceDto, WorkExperience>();

            // ResumeSkill mappings
            CreateMap<ResumeSkill, ResumeSkillDto>();
            CreateMap<CreateResumeSkillDto, ResumeSkill>();

            // Certificate mappings
            CreateMap<Certificate, CertificateDto>();
            CreateMap<CreateCertificateDto, Certificate>();

            // Language mappings
            CreateMap<Language, LanguageDto>();
            CreateMap<CreateLanguageDto, Language>();

            // Enum mappings (string representation)
            CreateMap<JobType, string>().ConvertUsing(src => src.ToString());
            CreateMap<ExperienceLevel, string>().ConvertUsing(src => src.ToString());
            CreateMap<SalaryType, string>().ConvertUsing(src => src.ToString());
            CreateMap<JobStatus, string>().ConvertUsing(src => src.ToString());
            CreateMap<ApplicationStatus, string>().ConvertUsing(src => src.ToString());
            CreateMap<SkillLevel, string>().ConvertUsing(src => src.ToString());
            CreateMap<LanguageProficiency, string>().ConvertUsing(src => src.ToString());
        }
    }
}
