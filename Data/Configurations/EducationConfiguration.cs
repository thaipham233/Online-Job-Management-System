using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class EducationConfiguration : IEntityTypeConfiguration<Education>
    {
        public void Configure(EntityTypeBuilder<Education> builder)
        {
            builder.ToTable("Educations");

            builder.Property(e => e.Institution)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.Degree)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.FieldOfStudy)
                .HasMaxLength(200);

            builder.Property(e => e.Description)
                .HasMaxLength(1000);

            builder.Property(e => e.GPA)
                .HasColumnType("decimal(3,2)");

            builder.HasIndex(e => e.ResumeId);
        }
    }
}
