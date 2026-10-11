using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Repositories.Interfaces;

public interface ICartRepository
{
    Task<CartItem> AddCartItemAsync(CartItem cartItem);
    Task<IEnumerable<CartItem>> GetUserCartItemsAsync(string dealerId);
    Task<CartItem?> GetCartItemByIdAsync(int id, string dealerId);
    Task<bool> UpdateCartItemAsync(CartItem cartItem);
    Task<bool> RemoveCartItemAsync(CartItem cartItem);
}