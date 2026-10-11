using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Services.Interfaces;
using CaseStudyCropDeal.Services;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Data;
using Microsoft.EntityFrameworkCore;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;
    private readonly IRazorpayService _razorpayService;
    private readonly ApplicationDbContext _context;

    public TransactionController(ITransactionService transactionService, IRazorpayService razorpayService, ApplicationDbContext context)
    {
        _transactionService = transactionService;
        _razorpayService = razorpayService;
        _context = context;
    }

    [HttpPost]
    [Authorize(Policy = "DealerOnly")]
    public async Task<IActionResult> ProcessPayment(int orderId, string paymentMethod)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
            var transaction = await _transactionService.ProcessPaymentAsync(orderId, paymentMethod, userId);
            return Ok(new { Message = "Payment processed successfully. Invoice and receipt generated.", Transaction = transaction });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactionHistory()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var transactions = await _transactionService.GetTransactionHistoryAsync(userId);
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransaction(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var transaction = await _transactionService.GetTransactionByIdAsync(id, userId);
        return transaction == null ? NotFound() : Ok(transaction);
    }

    [HttpPost("create-order")]
    [Authorize(Policy = "DealerOnly")]
    public async Task<IActionResult> CreateRazorpayOrder([FromBody] CreateRazorpayOrderRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var order = await _context.Orders
            .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.DealerId == userId && o.Status == Models.OrderStatus.Confirmed);
        if (order == null)
            return BadRequest("Order not found or not confirmed");
        try
        {
            var razorpayOrder = _razorpayService.CreateOrder(order.TotalAmount, $"order_{request.OrderId}");
            return Ok(razorpayOrder);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Razorpay error: {ex.Message}");
            return StatusCode(500, new { Message = "Failed to create Razorpay order. Check Razorpay credentials in appsettings.json." });
        }
    }

    [HttpPost("verify-payment")]
    [Authorize(Policy = "DealerOnly")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        if (!_razorpayService.VerifySignature(request.RazorpayOrderId, request.RazorpayPaymentId, request.RazorpaySignature))
            return BadRequest("Invalid payment signature");

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        try
        {
            var transaction = await _transactionService.ProcessPaymentAsync(request.OrderId, "Razorpay", userId);
            return Ok(new { Message = "Payment verified and processed successfully", Transaction = transaction });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
