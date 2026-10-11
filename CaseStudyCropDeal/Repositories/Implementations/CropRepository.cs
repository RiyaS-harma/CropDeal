using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class CropRepository : ICropRepository
{
    private readonly ApplicationDbContext _context;

    public CropRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Crop>> GetAvailableCropsAsync()
    {
        return await _context.Crops
            .Where(c => c.Status == CropStatus.Available && c.Quantity > 0)
            .ToListAsync();
    }

    public async Task<Crop?> GetCropByIdAsync(int id)
    {
        return await _context.Crops
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Crop> CreateCropAsync(CreateCropRequest request, string farmerId)
    {
        var crop = new Crop
        {
            FarmerId = farmerId,
            CropType = request.CropType,
            CropName = request.CropName,
            Quantity = request.Quantity,
            Unit = request.Unit,
            PricePerUnit = request.PricePerUnit,
            Location = request.Location,
            Description = request.Description,
            ImageUrl = request.ImageUrl
        };
        
        _context.Crops.Add(crop);
        await _context.SaveChangesAsync();
        return crop;
    }

    public async Task<Crop?> UpdateCropAsync(int id, UpdateCropRequest request, string farmerId)
    {
        var crop = await _context.Crops.FirstOrDefaultAsync(c => c.Id == id && c.FarmerId == farmerId);
        if (crop == null) return null;
        
        crop.CropType = request.CropType;
        crop.CropName = request.CropName;
        crop.Quantity = request.Quantity;
        crop.PricePerUnit = request.PricePerUnit;
        crop.Description = request.Description;
        
        await _context.SaveChangesAsync();
        return crop;
    }

    public async Task<bool> DeleteCropAsync(int id, string farmerId)
    {
        var crop = await _context.Crops.FirstOrDefaultAsync(c => c.Id == id && c.FarmerId == farmerId);
        if (crop == null) return false;

        var orderIds = await _context.Orders.Where(o => o.CropId == id).Select(o => o.Id).ToListAsync();

        var ratings = _context.RatingReviews.Where(r => orderIds.Contains(r.OrderId));
        _context.RatingReviews.RemoveRange(ratings);

        var transactions = _context.Transactions.Where(t => orderIds.Contains(t.OrderId));
        _context.Transactions.RemoveRange(transactions);

        var invoices = _context.Invoices.Where(i => orderIds.Contains(i.OrderId));
        _context.Invoices.RemoveRange(invoices);

        var receipts = _context.Receipts.Where(r => orderIds.Contains(r.OrderId));
        _context.Receipts.RemoveRange(receipts);

        var orders = _context.Orders.Where(o => o.CropId == id);
        _context.Orders.RemoveRange(orders);

        var cartItems = _context.CartItems.Where(ci => ci.CropId == id);
        _context.CartItems.RemoveRange(cartItems);

        _context.Crops.Remove(crop);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Crop>> GetFarmerCropsAsync(string farmerId)
    {
        return await _context.Crops
            .Where(c => c.FarmerId == farmerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Crop>> SearchCropsAsync(string? cropName, decimal? maxPrice, string? location)
    {
        var query = _context.Crops.Where(c => c.Status == CropStatus.Available && c.Quantity > 0);
        
        if (!string.IsNullOrEmpty(cropName))
            query = query.Where(c => c.CropName.Contains(cropName));
        if (maxPrice.HasValue)
            query = query.Where(c => c.PricePerUnit <= maxPrice.Value);
        if (!string.IsNullOrEmpty(location))
            query = query.Where(c => c.Location.Contains(location));
        
        return await query.ToListAsync();
    }
}