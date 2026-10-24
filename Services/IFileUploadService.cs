using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Text.RegularExpressions;

namespace Online_Job_Management_System.Services;

public interface IFileUploadService
{
    Task<string> UploadFileAsync(string folder, IFormFile file, string userId = null, string companyId = null);
    Task<string> UploadResumeAsync(IFormFile file, string userId);
    Task<string> UploadAvatarAsync(IFormFile file, string userId);
    Task<string> UploadCompanyLogoAsync(IFormFile file, string companyId);
    Task<bool> DeleteFileAsync(string filePath);
    string GetBaseUrl();
    string GetUploadPath(string folder);
}

public class FileUploadService : IFileUploadService
{
    private readonly string _baseUrl;
    private readonly IConfiguration _configuration;

    public FileUploadService(IConfiguration configuration)
    {
        _configuration = configuration;
        _baseUrl = configuration.GetValue<string>("App:Url") ?? "http://localhost:5128";
    }

    public string GetUploadPath(string folder)
    {
        var root = AppDomain.CurrentDomain.BaseDirectory;
        var uploadPath = Path.Combine(root, "wwwroot", "uploads", folder);
        Directory.CreateDirectory(uploadPath);
        return uploadPath;
    }

    public async Task<string> UploadFileAsync(string folder, IFormFile file, string userId = null, string companyId = null)
    {
        if (file == null || file.Length == 0)
            return null;

        var allowed = _configuration.GetSection("FileUpload:AllowedExtensions").Get<string[]>() ?? new[] { ".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowed.Contains(ext))
            throw new ArgumentException($"File type not allowed. Allowed: {string.Join(", ", allowed)}");

        var maxSize = _configuration.GetValue<int>("FileUpload:MaxFileSizeInMB") * 1024 * 1024;
        if (file.Length > maxSize)
            throw new ArgumentException($"File exceeds {maxSize / 1024 / 1024}MB limit");

        var folderPath = GetUploadPath(folder);
        var uniqueName = GenerateUniqueFileName(file.FileName, userId, companyId);
        var filePath = Path.Combine(folderPath, uniqueName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var relativePath = Path.Combine("uploads", folder, uniqueName).Replace("\\", "/");
        var fullUrl = $"{_baseUrl}/{relativePath}";
        return fullUrl;
    }

    public async Task<string> UploadResumeAsync(IFormFile file, string userId)
    {
        return await UploadFileAsync("resumes", file, userId);
    }

    public async Task<string> UploadAvatarAsync(IFormFile file, string userId)
    {
        return await UploadFileAsync("avatars", file, userId);
    }

    public async Task<string> UploadCompanyLogoAsync(IFormFile file, string companyId)
    {
        return await UploadFileAsync("companies", file, companyId: companyId);
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        if (string.IsNullOrEmpty(filePath)) return false;
        var fullPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot", filePath.TrimStart('/'));
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
            return true;
        }
        return false;
    }

    public string GetBaseUrl()
    {
        return _baseUrl;
    }

    private string GenerateUniqueFileName(string originalFileName, string userId = null, string companyId = null)
    {
        var name = Path.GetFileNameWithoutExtension(originalFileName);
        var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
        var random = new Random().Next(1000, 9999).ToString();
        var prefix = userId != null ? $"u{userId}_{name}" : companyId != null ? $"c{companyId}_{name}" : name;
        return $"{prefix}_{timestamp}_{random}{Path.GetExtension(originalFileName)}";
    }
}
