using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingReviewController : ControllerBase
{
    private readonly IRatingReviewService _ratingReviewService;

    public RatingReviewController(IRatingReviewService ratingReviewService)
    {
        _ratingReviewService = ratingReviewService;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitRating(int orderId, int rating, string? review)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var result = await _ratingReviewService.SubmitRatingAsync(orderId, rating, review, userId);
        return Ok(result);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserRatings(string userId)
    {
        var ratings = await _ratingReviewService.GetUserRatingsAsync(userId);
        return Ok(ratings);
    }

    [HttpGet("by-reviewer/{reviewerId}")]
    public async Task<IActionResult> GetRatingsByReviewer(string reviewerId)
    {
        var ratings = await _ratingReviewService.GetRatingsByReviewerAsync(reviewerId);
        return Ok(ratings);
    }
}