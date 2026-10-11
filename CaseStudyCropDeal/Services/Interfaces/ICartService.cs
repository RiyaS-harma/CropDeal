using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Services.Interfaces;

public interface ICartService
{
    Task<CartItem> AddToCartAsync(string dealerId, int cropId, decimal quantity);
    Task<IEnumerable<CartItem>> GetCartItemsAsync(string dealerId);
    Task<bool> UpdateQuantityAsync(int id, decimal quantity, string dealerId);
    Task<bool> RemoveFromCartAsync(int id, string dealerId);
}