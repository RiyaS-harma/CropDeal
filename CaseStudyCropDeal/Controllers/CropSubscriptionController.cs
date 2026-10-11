using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "DealerOnly")]
public class CropSubscriptionController : ControllerBase
{
    private readonly ICropSubscriptionService _cropSubscriptionService;

    public CropSubscriptionController(ICropSubscriptionService cropSubscriptionService)
    {
        _cropSubscriptionService = cropSubscriptionService;
    }

    [HttpPost]
    public async Task<IActionResult> Subscribe(SubscriptionRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var subscription = await _cropSubscriptionService.CreateSubscriptionAsync(request, userId);
        return Ok(subscription);
    }

    [HttpGet]
    public async Task<IActionResult> GetSubscriptions()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var subscriptions = await _cropSubscriptionService.GetSubscriptionsAsync(userId);
        return Ok(subscriptions);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Unsubscribe(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var result = await _cropSubscriptionService.DeleteSubscriptionAsync(id, userId);
        
        if (!result) return NotFound();
        
        return Ok(new { Message = "Unsubscribed successfully" });
    }
}
