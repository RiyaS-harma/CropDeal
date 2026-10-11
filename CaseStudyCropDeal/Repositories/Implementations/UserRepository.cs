using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;

    public UserRepository(UserManager<User> userManager, ApplicationDbContext context)
    {
        _userManager = userManager;
        _context = context;
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await _userManager.FindByIdAsync(userId);
    }

    public async Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Address = request.Address;
        user.PhoneNumber = request.PhoneNumber;

        await _userManager.UpdateAsync(user);
        return true;
    }

    public async Task<FarmerDashboardResponse> GetFarmerDashboardAsync(string farmerId)
    {
        var totalCrops = await _context.Crops.CountAsync(c => c.FarmerId == farmerId);
        var activeCrops = await _context.Crops.CountAsync(c => c.FarmerId == farmerId && c.Quantity > 0);
        var totalOrders = await _context.Orders.CountAsync(o => o.FarmerId == farmerId);
        var pendingOrders = await _context.Orders.CountAsync(o => o.FarmerId == farmerId && o.Status == OrderStatus.Pending);
        var totalEarnings = await _context.Transactions
            .Where(t => t.Order.FarmerId == farmerId && t.Status == TransactionStatus.Completed)
            .SumAsync(t => t.Amount);
        var ratings = await _context.RatingReviews
            .Where(r => r.RevieweeId == farmerId)
            .ToListAsync();

        return new FarmerDashboardResponse
        {
            TotalCrops = totalCrops,
            ActiveCrops = activeCrops,
            TotalOrders = totalOrders,
            PendingOrders = pendingOrders,
            TotalEarnings = totalEarnings,
            AverageRating = ratings.Any() ? ratings.Average(r => r.Rating) : 0,
            TotalReviews = ratings.Count
        };
    }

    public async Task<DealerDashboardResponse> GetDealerDashboardAsync(string dealerId)
    {
        var totalOrders = await _context.Orders.CountAsync(o => o.DealerId == dealerId);
        var completedOrders = await _context.Orders.CountAsync(o => o.DealerId == dealerId && o.Status == OrderStatus.Completed);
        var pendingOrders = await _context.Orders.CountAsync(o => o.DealerId == dealerId && o.Status == OrderStatus.Pending);
        var totalSpent = await _context.Transactions
            .Where(t => t.Order.DealerId == dealerId && t.Status == TransactionStatus.Completed)
            .SumAsync(t => t.Amount);
        var ratings = await _context.RatingReviews
            .Where(r => r.RevieweeId == dealerId)
            .ToListAsync();

        return new DealerDashboardResponse
        {
            TotalOrders = totalOrders,
            CompletedOrders = completedOrders,
            PendingOrders = pendingOrders,
            TotalSpent = totalSpent,
            AverageRating = ratings.Any() ? ratings.Average(r => r.Rating) : 0,
            TotalReviews = ratings.Count
        };
    }
}