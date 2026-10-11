using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class CartItemRepository : ICartItemRepository
{
    private readonly ApplicationDbContext _context;

    public CartItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem> AddToCartAsync(int cropId, decimal quantity, string dealerId)
    {
        var cartItem = new CartItem
        {
            DealerId = dealerId,
            CropId = cropId,
            Quantity = quantity
        };

        _context.CartItems.Add(cartItem);
        await _context.SaveChangesAsync();
        return cartItem;
    }

    public async Task<IEnumerable<CartItem>> GetCartItemsAsync(string dealerId)
    {
        return await _context.CartItems
            .Include(c => c.Crop)
            .Where(c => c.DealerId == dealerId)
            .ToListAsync();
    }

    public async Task<CartItem?> UpdateCartItemAsync(int id, decimal quantity, string dealerId)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.DealerId == dealerId);
        
        if (cartItem == null) return null;

        cartItem.Quantity = quantity;
        await _context.SaveChangesAsync();
        return cartItem;
    }

    public async Task<bool> RemoveFromCartAsync(int id, string dealerId)
    {
        var cartItem = await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.DealerId == dealerId);
        
        if (cartItem == null) return false;

        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();
        return true;
    }
}