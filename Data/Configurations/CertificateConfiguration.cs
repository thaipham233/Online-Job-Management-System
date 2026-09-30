using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Online_Job_Management_System.Models;

namespace Online_Job_Management_System.Data.Configurations
{
    public class CertificateConfiguration : IEntityTypeConfiguration<Certificate>
    {
        public void Configure(EntityTypeBuilder<Certificate> builder)
        {
            builder.ToTable("Certificates");

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(c => c.IssuingOrganization)
                .HasMaxLength(200);

            builder.Property(c => c.CredentialId)
                .HasMaxLength(500);

            builder.Property(c => c.CredentialUrl)
                .HasMaxLength(500);

            builder.HasIndex(c => c.ResumeId);
        }
    }
}
