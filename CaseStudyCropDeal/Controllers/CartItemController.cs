using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "DealerOnly")]
public class CartItemController : ControllerBase
{
    private readonly ICartItemService _cartService;

    public CartItemController(ICartItemService cartService)
    {
        _cartService = cartService;
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart(int cropId, decimal quantity)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var cartItem = await _cartService.AddToCartAsync(cropId, quantity, userId);
        return Ok(cartItem);
    }

    [HttpGet]
    public async Task<IActionResult> GetCartItems()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var cartItems = await _cartService.GetCartItemsAsync(userId);
        return Ok(cartItems);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateQuantity(int id, decimal quantity)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var result = await _cartService.UpdateCartItemAsync(id, quantity, userId);
        return result != null ? Ok(result) : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> RemoveFromCart(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var success = await _cartService.RemoveFromCartAsync(id, userId);
        return success ? Ok(new { Message = "Item removed from cart" }) : NotFound();
    }
}
