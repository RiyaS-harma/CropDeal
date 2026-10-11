using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class CropSubscriptionRepository : ICropSubscriptionRepository
{
    private readonly ApplicationDbContext _context;

    public CropSubscriptionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CropSubscription> CreateSubscriptionAsync(SubscriptionRequest request, string dealerId)
    {
        var subscription = new CropSubscription
        {
            DealerId = dealerId,
            CropType = request.CropType,
            CropName = request.CropName,
            Location = request.Location
        };

        _context.CropSubscriptions.Add(subscription);
        await _context.SaveChangesAsync();
        return subscription;
    }

    public async Task<IEnumerable<CropSubscription>> GetSubscriptionsAsync(string dealerId)
    {
        return await _context.CropSubscriptions
            .Where(s => s.DealerId == dealerId)
            .ToListAsync();
    }

    public async Task<bool> DeleteSubscriptionAsync(int id, string dealerId)
    {
        var subscription = await _context.CropSubscriptions
            .FirstOrDefaultAsync(s => s.Id == id && s.DealerId == dealerId);
        
        if (subscription == null) return false;

        _context.CropSubscriptions.Remove(subscription);
        await _context.SaveChangesAsync();
        return true;
    }
}