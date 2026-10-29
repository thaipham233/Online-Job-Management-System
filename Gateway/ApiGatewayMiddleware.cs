using System.Net.Http.Headers;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Primitives;

namespace Online_Job_Management_System.Gateway;

/// <summary>
/// Configuration options for the API Gateway
/// </summary>
public class GatewayOptions
{
    public bool Enabled { get; set; } = true;
    public int RateLimitRequests { get; set; } = 100;
    public TimeSpan RateLimitWindow { get; set; } = TimeSpan.FromMinutes(1);
    public List<string> ExcludedPaths { get; set; } = new() { "/swagger", "/health", "/favicon.ico" };
    public bool EnableRequestLogging { get; set; } = true;
    public bool EnableResponseLogging { get; set; } = false;
    public int MaxRequestBodySize { get; set; } = 10 * 1024 * 1024; // 10MB
    public TimeSpan RequestTimeout { get; set; } = TimeSpan.FromSeconds(30);
}

/// <summary>
/// In-memory rate limiter (for single instance). Use Redis for distributed.
/// </summary>
public interface IRateLimiter
{
    Task<bool> TryAcquireAsync(string key, int limit, TimeSpan window);
    Task<RateLimitInfo> GetInfoAsync(string key);
}

public record RateLimitInfo(int Limit, int Remaining, TimeSpan ResetAfter);

public class InMemoryRateLimiter : IRateLimiter
{
    private readonly Dictionary<string, (int Count, DateTime WindowStart)> _counters = new();
    private readonly object _lock = new();

    public Task<bool> TryAcquireAsync(string key, int limit, TimeSpan window)
    {
        lock (_lock)
        {
            var now = DateTime.UtcNow;
            if (!_counters.TryGetValue(key, out var entry) || now - entry.WindowStart >= window)
            {
                _counters[key] = (1, now);
                return Task.FromResult(true);
            }

            if (entry.Count >= limit)
            {
                return Task.FromResult(false);
            }

            _counters[key] = (entry.Count + 1, entry.WindowStart);
            return Task.FromResult(true);
        }
    }

    public Task<RateLimitInfo> GetInfoAsync(string key)
    {
        lock (_lock)
        {
            var now = DateTime.UtcNow;
            if (!_counters.TryGetValue(key, out var entry))
            {
                return Task.FromResult(new RateLimitInfo(0, 0, TimeSpan.Zero));
            }

            var elapsed = now - entry.WindowStart;
            var remaining = Math.Max(0, 100 - entry.Count); // default limit
            return Task.FromResult(new RateLimitInfo(100, remaining, TimeSpan.FromMinutes(1) - elapsed));
        }
    }
}

/// <summary>
/// API Gateway Middleware - provides cross-cutting concerns without changing existing endpoints
/// </summary>
public class ApiGatewayMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiGatewayMiddleware> _logger;
    private readonly GatewayOptions _options;
    private readonly IRateLimiter _rateLimiter;

    public ApiGatewayMiddleware(
        RequestDelegate next,
        ILogger<ApiGatewayMiddleware> logger,
        IOptions<GatewayOptions> options,
        IRateLimiter rateLimiter)
    {
        _next = next;
        _logger = logger;
        _options = options.Value;
        _rateLimiter = rateLimiter;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Skip if gateway disabled or path excluded
        if (!_options.Enabled || IsExcludedPath(context.Request.Path))
        {
            await _next(context);
            return;
        }

        var requestId = context.TraceIdentifier;
        var clientIp = GetClientIp(context);
        var path = context.Request.Path.Value ?? "";
        var method = context.Request.Method;

        // Rate limiting
        var rateLimitKey = $"{clientIp}:{path}";
        var allowed = await _rateLimiter.TryAcquireAsync(rateLimitKey, _options.RateLimitRequests, _options.RateLimitWindow);
        var rateLimitInfo = await _rateLimiter.GetInfoAsync(rateLimitKey);

        // Add rate limit headers
        context.Response.Headers.Append("X-RateLimit-Limit", rateLimitInfo.Limit.ToString());
        context.Response.Headers.Append("X-RateLimit-Remaining", rateLimitInfo.Remaining.ToString());
        context.Response.Headers.Append("X-RateLimit-Reset", ((int)rateLimitInfo.ResetAfter.TotalSeconds).ToString());

        if (!allowed)
        {
            _logger.LogWarning("Rate limit exceeded for {ClientIp} on {Path}", clientIp, path);
            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.Response.Headers.Append("Retry-After", ((int)_options.RateLimitWindow.TotalSeconds).ToString());
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Rate limit exceeded",
                message = "Too many requests. Please try again later.",
                retryAfterSeconds = (int)_options.RateLimitWindow.TotalSeconds
            });
            return;
        }

        // Request logging
        if (_options.EnableRequestLogging)
        {
            _logger.LogInformation("Gateway: {Method} {Path} from {ClientIp} [{RequestId}]", method, path, clientIp, requestId);
        }

        // Request body size limit
        if (context.Request.ContentLength > _options.MaxRequestBodySize)
        {
            _logger.LogWarning("Request body too large: {Size} bytes from {ClientIp}", context.Request.ContentLength, clientIp);
            context.Response.StatusCode = StatusCodes.Status413PayloadTooLarge;
            await context.Response.WriteAsJsonAsync(new { error = "Payload too large" });
            return;
        }

        // Add gateway headers
        context.Response.Headers.Append("X-Gateway", "JobHub-Gateway/1.0");
        context.Response.Headers.Append("X-Request-Id", requestId);

        // Execute with timeout
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(context.RequestAborted);
        cts.CancelAfter(_options.RequestTimeout);

        try
        {
            await _next(context);
        }
        catch (OperationCanceledException) when (cts.Token.IsCancellationRequested)
        {
            _logger.LogWarning("Request timeout for {Method} {Path} [{RequestId}]", method, path, requestId);
            context.Response.StatusCode = StatusCodes.Status504GatewayTimeout;
            await context.Response.WriteAsJsonAsync(new { error = "Gateway timeout" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gateway error for {Method} {Path} [{RequestId}]", method, path, requestId);
            throw; // Let GlobalExceptionMiddleware handle it
        }

        // Response logging
        if (_options.EnableResponseLogging)
        {
            _logger.LogInformation("Gateway: {Method} {Path} -> {StatusCode} [{RequestId}]", method, path, context.Response.StatusCode, requestId);
        }
    }

    private bool IsExcludedPath(PathString path)
    {
        var pathValue = path.Value?.ToLowerInvariant() ?? "";
        return _options.ExcludedPaths.Any(p => pathValue.StartsWith(p.ToLowerInvariant()));
    }

    private string GetClientIp(HttpContext context)
    {
        // Check X-Forwarded-For header (for reverse proxy scenarios)
        if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            return forwardedFor.FirstOrDefault()?.Split(',')[0].Trim() ?? context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }
        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }
}

/// <summary>
/// Extension method to register gateway services
/// </summary>
public static class GatewayServiceCollectionExtensions
{
    public static IServiceCollection AddApiGateway(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<GatewayOptions>(configuration.GetSection("Gateway"));
        services.AddSingleton<IRateLimiter, InMemoryRateLimiter>();
        services.AddHttpClient();
        return services;
    }
}

/// <summary>
/// Extension method to use gateway middleware
/// </summary>
public static class GatewayApplicationBuilderExtensions
{
    public static IApplicationBuilder UseApiGateway(this IApplicationBuilder app)
    {
        return app.UseMiddleware<ApiGatewayMiddleware>();
    }
}
