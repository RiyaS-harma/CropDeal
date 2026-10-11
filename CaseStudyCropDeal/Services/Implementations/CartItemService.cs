using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class CartItemService : ICartItemService
{
    private readonly ICartItemRepository _cartItemRepository;

    public CartItemService(ICartItemRepository cartItemRepository)
    {
        _cartItemRepository = cartItemRepository;
    }

    public async Task<CartItem> AddToCartAsync(int cropId, decimal quantity, string dealerId)
    {
        return await _cartItemRepository.AddToCartAsync(cropId, quantity, dealerId);
    }

    public async Task<IEnumerable<CartItem>> GetCartItemsAsync(string dealerId)
    {
        return await _cartItemRepository.GetCartItemsAsync(dealerId);
    }

    public async Task<CartItem?> UpdateCartItemAsync(int id, decimal quantity, string dealerId)
    {
        return await _cartItemRepository.UpdateCartItemAsync(id, quantity, dealerId);
    }

    public async Task<bool> RemoveFromCartAsync(int id, string dealerId)
    {
        return await _cartItemRepository.RemoveFromCartAsync(id, dealerId);
    }
}