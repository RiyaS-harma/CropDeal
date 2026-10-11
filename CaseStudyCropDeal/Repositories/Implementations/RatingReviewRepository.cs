using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class RatingReviewRepository : IRatingReviewRepository
{
    private readonly ApplicationDbContext _context;

    public RatingReviewRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> GetOrderByIdAsync(int orderId, string userId)
    {
        return await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId && 
            (o.FarmerId == userId || o.DealerId == userId));
    }

    public async Task<RatingReview> CreateRatingReviewAsync(RatingReview ratingReview)
    {
        _context.RatingReviews.Add(ratingReview);
        await _context.SaveChangesAsync();
        return ratingReview;
    }

    public async Task<IEnumerable<RatingReview>> GetUserRatingsAsync(string userId)
    {
        return await _context.RatingReviews
            .Where(r => r.RevieweeId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<RatingReview>> GetRatingsByReviewerAsync(string reviewerId)
    {
        return await _context.RatingReviews
            .Where(r => r.ReviewerId == reviewerId)
            .ToListAsync();
    }
}