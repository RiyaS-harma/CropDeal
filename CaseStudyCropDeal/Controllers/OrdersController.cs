using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    [Authorize(Policy = "DealerOnly")]
    public async Task<IActionResult> CreateOrder(CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var order = await _orderService.CreateOrderAsync(request, userId);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var order = await _orderService.GetOrderByIdAsync(id, userId);
        return order == null ? NotFound() : Ok(order);
    }

    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpPut("{id}/confirm")]
    [Authorize(Policy = "FarmerOnly")]
    public async Task<IActionResult> ConfirmOrder(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var success = await _orderService.ConfirmOrderAsync(id, userId);
        return success ? Ok(new { Message = "Order confirmed. Dealer can now proceed with payment." }) : NotFound();
    }
}