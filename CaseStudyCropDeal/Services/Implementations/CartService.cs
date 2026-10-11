using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;

    public CartService(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<CartItem> AddToCartAsync(string dealerId, int cropId, decimal quantity)
    {
        var cartItem = new CartItem
        {
            DealerId = dealerId,
            CropId = cropId,
            Quantity = quantity
        };
        return await _cartRepository.AddCartItemAsync(cartItem);
    }

    public async Task<IEnumerable<CartItem>> GetCartItemsAsync(string dealerId)
    {
        return await _cartRepository.GetUserCartItemsAsync(dealerId);
    }

    public async Task<bool> UpdateQuantityAsync(int id, decimal quantity, string dealerId)
    {
        var cartItem = await _cartRepository.GetCartItemByIdAsync(id, dealerId);
        if (cartItem == null) return false;

        cartItem.Quantity = quantity;
        return await _cartRepository.UpdateCartItemAsync(cartItem);
    }

    public async Task<bool> RemoveFromCartAsync(int id, string dealerId)
    {
        var cartItem = await _cartRepository.GetCartItemByIdAsync(id, dealerId);
        if (cartItem == null) return false;

        return await _cartRepository.RemoveCartItemAsync(cartItem);
    }
}