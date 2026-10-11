using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Services.Interfaces;

public interface IRatingReviewService
{
    Task<RatingReview> SubmitRatingAsync(int orderId, int rating, string? review, string userId);
    Task<IEnumerable<RatingReview>> GetUserRatingsAsync(string userId);
    Task<IEnumerable<RatingReview>> GetRatingsByReviewerAsync(string reviewerId);
}