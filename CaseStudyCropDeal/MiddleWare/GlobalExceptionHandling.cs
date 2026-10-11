using System.Net;
using System.Text.Json;

namespace CaseStudyCropDeal.MiddleWare;

public class GlobalExceptionHandling
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandling> _logger;

    public GlobalExceptionHandling(RequestDelegate next, ILogger<GlobalExceptionHandling> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            message = "An error occurred",
            details = exception.Message
        };

        switch (exception)
        {
            case ArgumentNullException:
            case ArgumentException:
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                response = new { message = "Invalid request", details = exception.Message };
                break;
            
            case UnauthorizedAccessException:
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                response = new { message = "Unauthorized access", details = "Access denied" };
                break;
            
            case KeyNotFoundException:
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                response = new { message = "Resource not found", details = exception.Message };
                break;
            
            default:
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                response = new { message = "Internal server error", details = "Something went wrong" };
                break;
        }

        var jsonResponse = JsonSerializer.Serialize(response);
        await context.Response.WriteAsync(jsonResponse);
    }
}