using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class CartRepository : ICartRepository
{
    private readonly ApplicationDbContext _context;

    public CartRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CartItem> AddCartItemAsync(CartItem cartItem)
    {
        _context.CartItems.Add(cartItem);
        await _context.SaveChangesAsync();
        return cartItem;
    }

    public async Task<IEnumerable<CartItem>> GetUserCartItemsAsync(string dealerId)
    {
        return await _context.CartItems
            .Include(c => c.Crop)
            .Where(c => c.DealerId == dealerId)
            .ToListAsync();
    }

    public async Task<CartItem?> GetCartItemByIdAsync(int id, string dealerId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(c => c.Id == id && c.DealerId == dealerId);
    }

    public async Task<bool> UpdateCartItemAsync(CartItem cartItem)
    {
        _context.CartItems.Update(cartItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveCartItemAsync(CartItem cartItem)
    {
        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();
        return true;
    }
}