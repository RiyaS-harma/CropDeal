using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.Google;
using System.Security.Claims;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly ApplicationDbContext _context;

    public ChatController(IConfiguration config, ApplicationDbContext context)
    {
        _config = config;
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest("Message is required");

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;

        var apiKey = _config["Gemini:ApiKey"]!;
        var modelId = _config["Gemini:ModelId"]!;

        // Build Semantic Kernel with Gemini
        var kernel = Kernel.CreateBuilder()
            .AddGoogleAIGeminiChatCompletion(modelId, apiKey, GoogleAIVersion.V1_Beta)
            .Build();

        var chatService = kernel.GetRequiredService<IChatCompletionService>();

        // Load chat history from DB
        var history = new ChatHistory(@"You are Novo, a helpful AI assistant for CropDeal — an agricultural marketplace platform connecting farmers and dealers.

Platform features:
- Farmers can register, publish crops with price and quantity, manage orders, view receipts, ratings
- Dealers can browse marketplace, add crops to cart, place orders, make payments via Razorpay, view invoices, subscribe to crops
- Both can view transaction history, ratings/reviews, and their dashboard
- Admin can manage farmers and dealers, view reports

How to use CropDeal:
1. Register as Farmer or Dealer
2. Login to access your dashboard
3. Farmers: Go to 'Publish Crop' to list your crops with name, price, quantity
4. Dealers: Go to 'Marketplace' to browse crops, add to cart, place orders
5. Once farmer confirms order, dealer can make payment
6. After payment, invoice and receipt are generated automatically

IMPORTANT: Always give complete answers. Never cut off mid-sentence. Do not use markdown formatting like ** or ##. Use plain text only. Be friendly and concise.");

        var previousMessages = _context.ChatMessages
            .Where(m => m.UserId == userId)
            .OrderBy(m => m.CreatedAt)
            .ToList()
            .TakeLast(10)
            .ToList();

        foreach (var msg in previousMessages)
        {
            history.AddUserMessage(msg.UserMessage);
            history.AddAssistantMessage(msg.BotResponse);
        }

        history.AddUserMessage(request.Message);

        // Get response from Gemini via Semantic Kernel
        ChatMessageContent result;

        try
        {
            var executionSettings = new GeminiPromptExecutionSettings
            {
                MaxTokens = 1024
            };
            result = await chatService.GetChatMessageContentAsync(history, executionSettings);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
        }
        var reply = result.Content ?? "Sorry, I could not process your request.";

        // Save to DB
        _context.ChatMessages.Add(new ChatMessage
        {
            UserId = userId,
            UserMessage = request.Message,
            BotResponse = reply,
            CreatedAt = DateTime.UtcNow
        });
        await _context.SaveChangesAsync();

        return Ok(new { response = reply });
    }

    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var messages = _context.ChatMessages
            .Where(m => m.UserId == userId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new { m.UserMessage, m.BotResponse, m.CreatedAt })
            .ToList();
        return Ok(messages);
    }

    [HttpDelete("history")]
    public async Task<IActionResult> ClearHistory()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var messages = _context.ChatMessages.Where(m => m.UserId == userId).ToList();
        _context.ChatMessages.RemoveRange(messages);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Chat history cleared" });
    }
}

public class ChatRequest
{
    public string Message { get; set; } = string.Empty;
}
