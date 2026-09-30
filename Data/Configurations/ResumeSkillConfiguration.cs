using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class ResumeSkillConfiguration : IEntityTypeConfiguration<ResumeSkill>
    {
        public void Configure(EntityTypeBuilder<ResumeSkill> builder)
        {
            builder.ToTable("ResumeSkills");

            builder.Property(s => s.SkillName)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.Level)
                .HasDefaultValue(SkillLevel.Beginner);

            builder.Property(s => s.YearsOfExperience)
                .HasDefaultValue(0);

            builder.HasIndex(s => s.ResumeId);
            builder.HasIndex(s => new { s.ResumeId, s.SkillName }).IsUnique();
        }
    }
}
