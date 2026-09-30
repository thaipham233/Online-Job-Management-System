using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class JobConfiguration : IEntityTypeConfiguration<Job>
    {
        public void Configure(EntityTypeBuilder<Job> builder)
        {
            builder.ToTable("Jobs");

            builder.Property(j => j.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(j => j.ShortDescription)
                .HasMaxLength(500);

            builder.Property(j => j.Description)
                .IsRequired();

            builder.Property(j => j.Requirements)
                .IsRequired();

            builder.Property(j => j.Benefits)
                .IsRequired();

            builder.Property(j => j.Location)
                .HasMaxLength(100);

            builder.Property(j => j.Skills)
                .HasMaxLength(200);

            builder.Property(j => j.SalaryMin)
                .HasColumnType("decimal(18,2)");

            builder.Property(j => j.SalaryMax)
                .HasColumnType("decimal(18,2)");

            builder.Property(j => j.ViewCount)
                .HasDefaultValue(0);

            builder.Property(j => j.Status)
                .HasDefaultValue(JobStatus.Draft);

            builder.Property(j => j.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(j => j.CompanyId);
            builder.HasIndex(j => j.CategoryId);
            builder.HasIndex(j => j.Status);
            builder.HasIndex(j => j.CreatedAt);
            builder.HasIndex(j => j.ExpiredDate);
            builder.HasIndex(j => new { j.Status, j.ExpiredDate });

            // Relationships
            builder.HasOne(j => j.Company)
                .WithMany(c => c.Jobs)
                .HasForeignKey(j => j.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(j => j.Category)
                .WithMany(c => c.Jobs)
                .HasForeignKey(j => j.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(j => j.CreatedByUser)
                .WithMany()
                .HasForeignKey(j => j.CreatedByUserId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(j => j.Applications)
                .WithOne(a => a.Job)
                .HasForeignKey(a => a.JobId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
