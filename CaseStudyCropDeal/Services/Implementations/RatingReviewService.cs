using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class RatingReviewService : IRatingReviewService
{
    private readonly IRatingReviewRepository _ratingReviewRepository;

    public RatingReviewService(IRatingReviewRepository ratingReviewRepository)
    {
        _ratingReviewRepository = ratingReviewRepository;
    }

    public async Task<RatingReview> SubmitRatingAsync(int orderId, int rating, string? review, string userId)
    {
        var order = await _ratingReviewRepository.GetOrderByIdAsync(orderId, userId);
        if (order == null) throw new ArgumentException("Order not found or unauthorized");

        var revieweeId = order.FarmerId == userId ? order.DealerId : order.FarmerId;

        var ratingReview = new RatingReview
        {
            ReviewerId = userId,
            RevieweeId = revieweeId,
            OrderId = orderId,
            Rating = rating,
            Review = review
        };

        return await _ratingReviewRepository.CreateRatingReviewAsync(ratingReview);
    }

    public async Task<IEnumerable<RatingReview>> GetUserRatingsAsync(string userId)
    {
        return await _ratingReviewRepository.GetUserRatingsAsync(userId);
    }

    public async Task<IEnumerable<RatingReview>> GetRatingsByReviewerAsync(string reviewerId)
    {
        return await _ratingReviewRepository.GetRatingsByReviewerAsync(reviewerId);
    }
}