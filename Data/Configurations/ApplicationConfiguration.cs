using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class ApplicationConfiguration : IEntityTypeConfiguration<Application>
    {
        public void Configure(EntityTypeBuilder<Application> builder)
        {
            builder.ToTable("Applications");

            builder.Property(a => a.CoverLetter)
                .HasMaxLength(1000);

            builder.Property(a => a.RejectionReason)
                .HasMaxLength(1000);

            builder.Property(a => a.Notes)
                .HasMaxLength(1000);

            builder.Property(a => a.Status)
                .HasDefaultValue(ApplicationStatus.Pending);

            builder.Property(a => a.AppliedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(a => a.JobId);
            builder.HasIndex(a => a.UserId);
            builder.HasIndex(a => a.Status);
            builder.HasIndex(a => new { a.JobId, a.UserId }).IsUnique();

            // Relationships
            builder.HasOne(a => a.Job)
                .WithMany(j => j.Applications)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.User)
                .WithMany(u => u.Applications)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.Resume)
                .WithMany(r => r.Applications)
                .HasForeignKey(a => a.ResumeId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(a => a.ReviewedByUser)
                .WithMany()
                .HasForeignKey(a => a.ReviewedByUserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
