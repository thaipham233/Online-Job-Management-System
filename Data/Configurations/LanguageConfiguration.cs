using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class LanguageConfiguration : IEntityTypeConfiguration<Language>
    {
        public void Configure(EntityTypeBuilder<Language> builder)
        {
            builder.ToTable("Languages");

            builder.Property(l => l.Name)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(l => l.Proficiency)
                .HasDefaultValue(LanguageProficiency.Basic);

            builder.HasIndex(l => l.ResumeId);
            builder.HasIndex(l => new { l.ResumeId, l.Name }).IsUnique();
        }
    }
}
