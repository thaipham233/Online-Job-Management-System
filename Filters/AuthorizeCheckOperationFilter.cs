using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Online_Job_Management_System.Filters;

/// <summary>
/// Operation filter that automatically adds security requirements to operations
/// based on the presence of [Authorize] attributes on controllers and actions.
/// </summary>
public class AuthorizeCheckOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Check if the controller has [Authorize] attribute
        var controllerAuthorize = context.MethodInfo.DeclaringType?
            .GetCustomAttributes(true)
            .OfType<AuthorizeAttribute>()
            .Any() ?? false;

        // Check if the action method has [Authorize] attribute
        var actionAuthorize = context.MethodInfo
            .GetCustomAttributes(true)
            .OfType<AuthorizeAttribute>()
            .Any();

        // Check for [AllowAnonymous] attribute (should override [Authorize])
        var allowAnonymous = context.MethodInfo
            .GetCustomAttributes(true)
            .OfType<AllowAnonymousAttribute>()
            .Any();

        // Also check controller level [AllowAnonymous]
        var controllerAllowAnonymous = context.MethodInfo.DeclaringType?
            .GetCustomAttributes(true)
            .OfType<AllowAnonymousAttribute>()
            .Any() ?? false;

        // If AllowAnonymous is present, don't add security requirement
        if (allowAnonymous || controllerAllowAnonymous)
        {
            return;
        }

        // If either controller or action has [Authorize], add security requirement
        if (controllerAuthorize || actionAuthorize)
        {
            operation.Security = new List<OpenApiSecurityRequirement>
            {
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                }
            };
        }
    }
}
