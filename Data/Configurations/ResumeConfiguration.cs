using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class ResumeConfiguration : IEntityTypeConfiguration<Resume>
    {
        public void Configure(EntityTypeBuilder<Resume> builder)
        {
            builder.ToTable("Resumes");

            builder.Property(r => r.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(r => r.Summary)
                .HasMaxLength(1000);

            builder.Property(r => r.FileUrl)
                .HasMaxLength(500);

            builder.Property(r => r.CurrentPosition)
                .HasMaxLength(100);

            builder.Property(r => r.CurrentCompany)
                .HasMaxLength(200);

            builder.Property(r => r.PreferredLocation)
                .HasMaxLength(100);

            builder.Property(r => r.ExpectedSalary)
                .HasColumnType("decimal(18,2)");

            builder.Property(r => r.IsDefault)
                .HasDefaultValue(false);

            builder.Property(r => r.IsPublic)
                .HasDefaultValue(false);

            builder.Property(r => r.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(r => r.UserId);
            builder.HasIndex(r => r.IsDefault);

            // Relationships
            builder.HasOne(r => r.User)
                .WithMany(u => u.Resumes)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.Educations)
                .WithOne(e => e.Resume)
                .HasForeignKey(e => e.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.WorkExperiences)
                .WithOne(w => w.Resume)
                .HasForeignKey(w => w.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.ResumeSkills)
                .WithOne(s => s.Resume)
                .HasForeignKey(s => s.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.Certificates)
                .WithOne(c => c.Resume)
                .HasForeignKey(c => c.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.Languages)
                .WithOne(l => l.Resume)
                .HasForeignKey(l => l.ResumeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
