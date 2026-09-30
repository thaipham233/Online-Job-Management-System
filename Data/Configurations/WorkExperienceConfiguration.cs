using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class WorkExperienceConfiguration : IEntityTypeConfiguration<WorkExperience>
    {
        public void Configure(EntityTypeBuilder<WorkExperience> builder)
        {
            builder.ToTable("WorkExperiences");

            builder.Property(w => w.Company)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(w => w.Position)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(w => w.Location)
                .HasMaxLength(200);

            builder.Property(w => w.Description)
                .HasMaxLength(2000);

            builder.HasIndex(w => w.ResumeId);
        }
    }
}
