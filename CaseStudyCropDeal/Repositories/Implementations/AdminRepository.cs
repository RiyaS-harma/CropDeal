using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class AdminRepository : IAdminRepository
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public AdminRepository(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IEnumerable<User>> GetAllFarmersAsync()
    {
        return await _userManager.Users
            .Where(u => u.UserType == UserType.Farmer)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetAllDealersAsync()
    {
        return await _userManager.Users
            .Where(u => u.UserType == UserType.Dealer)
            .ToListAsync();
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _userManager.Users.ToListAsync();
    }

    public async Task<IEnumerable<Crop>> GetAllCropsAsync()
    {
        return await _context.Crops.ToListAsync();
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        return await _context.Orders
            .Include(o => o.Crop)
            .ToListAsync();
    }

    public async Task<object> GetSummaryReportAsync()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var totalFarmers = await _userManager.Users.CountAsync(u => u.UserType == UserType.Farmer);
        var totalDealers = await _userManager.Users.CountAsync(u => u.UserType == UserType.Dealer);
        var totalCrops = await _context.Crops.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);

        return new {
            TotalUsers = totalUsers,
            TotalFarmers = totalFarmers,
            TotalDealers = totalDealers,
            TotalCrops = totalCrops,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue
        };
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await _userManager.FindByIdAsync(userId);
    }

    public async Task<bool> UpdateUserAsync(User user)
    {
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<bool> DeleteUserAsync(User user)
    {
        var result = await _userManager.DeleteAsync(user);
        return result.Succeeded;
    }

    public async Task<bool> DeleteCropAsync(int cropId)
    {
        var crop = await _context.Crops.FindAsync(cropId);
        if (crop == null) return false;

        _context.Crops.Remove(crop);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Order?> GetOrderByIdAsync(int orderId)
    {
        return await _context.Orders.FindAsync(orderId);
    }

    public async Task<bool> UpdateOrderAsync(Order order)
    {
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
        return true;
    }
}