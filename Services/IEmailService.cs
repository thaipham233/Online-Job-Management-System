using MimeKit;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;

namespace Online_Job_Management_System.Services;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, string fromEmail = null, string fromName = null);
    Task SendPasswordResetEmailAsync(string to, string resetToken, string resetUrl);
    Task SendWelcomeEmailAsync(string to, string userName);
}

public class EmailService : IEmailService
{
    private readonly SmtpSettings _smtpSettings;

    public EmailService(IConfiguration configuration)
    {
        _smtpSettings = new SmtpSettings
        {
            Server = configuration.GetValue<string>("Email:SmtpServer") ?? "smtp.gmail.com",
            Port = configuration.GetValue<int>("Email:SmtpPort", 587),
            Username = configuration.GetValue<string>("Email:SmtpUsername"),
            Password = configuration.GetValue<string>("Email:SmtpPassword"),
            FromEmail = configuration.GetValue<string>("Email:FromEmail"),
            FromName = configuration.GetValue<string>("Email:FromName"),
            EnableSsl = configuration.GetValue<bool>("Email:EnableSsl", true)
        };
    }

    public async Task SendEmailAsync(string to, string subject, string body, string fromEmail = null, string fromName = null)
    {
        if (string.IsNullOrEmpty(_smtpSettings.Username) || string.IsNullOrEmpty(_smtpSettings.Password))
        {
            // No SMTP configured, skip silently
            return;
        }

        var from = fromEmail ?? _smtpSettings.FromEmail ?? _smtpSettings.Username;
        var fromNameLocal = fromName ?? _smtpSettings.FromName;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromNameLocal, from));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };

        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpSettings.Server, _smtpSettings.Port, _smtpSettings.EnableSsl);
        await client.AuthenticateAsync(_smtpSettings.Username, _smtpSettings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    public async Task SendPasswordResetEmailAsync(string to, string resetToken, string resetUrl)
    {
        var subject = "Đặt lại mật khẩu - JobHub";
        var body = $@"
            <p>Xin chào,</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Nhấp vào đường link bên dưới để đặt lại mật khẩu:</p>
            <p><a href=""{resetUrl}"">{resetUrl}</a></p>
            <p>Link này sẽ hết hạn sau <strong>1 giờ</strong>.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Cảm ơn,<br>Đội ngũ JobHub</p>";
        await SendEmailAsync(to, subject, body);
    }

    public async Task SendWelcomeEmailAsync(string to, string userName)
    {
        var subject = "Chào mừng đến với JobHub!";
        var body = $@"
            <p>Xin chào <strong>{userName}</strong>,</p>
            <p>Chúc mừng bạn đã đăng ký thành công tài khoản JobHub!</p>
            <p>Bạn có thể bây giờ tìm kiếm công việc, nộp hồ sơ và quản lý phương thức ứng tuyển của mình.</p>
            <p>Trở lại trang chủ: <a href=""https://jobhub.com"">https://jobhub.com</a></p>
            <p>Chúc bạn việc làm may mắn!</p>
            <p>Đội ngũ JobHub</p>";
        await SendEmailAsync(to, subject, body);
    }
}

public class SmtpSettings
{
    public string Server { get; set; } = "smtp.gmail.com";
    public int Port { get; set; } = 587;
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string FromEmail { get; set; } = "";
    public string FromName { get; set; } = "Online Job Management System";
    public bool EnableSsl { get; set; } = true;
}
