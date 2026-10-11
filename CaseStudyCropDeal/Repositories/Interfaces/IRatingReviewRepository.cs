using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Repositories.Interfaces;

public interface IRatingReviewRepository
{
    Task<Order?> GetOrderByIdAsync(int orderId, string userId);
    Task<RatingReview> CreateRatingReviewAsync(RatingReview ratingReview);
    Task<IEnumerable<RatingReview>> GetUserRatingsAsync(string userId);
    Task<IEnumerable<RatingReview>> GetRatingsByReviewerAsync(string reviewerId);
}