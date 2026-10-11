using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoiceReceiptController : ControllerBase
{
    private readonly IInvoiceReceiptService _invoiceReceiptService;

    public InvoiceReceiptController(IInvoiceReceiptService invoiceReceiptService)
    {
        _invoiceReceiptService = invoiceReceiptService;
    }

    [HttpGet("invoices")]
    [Authorize(Policy = "DealerOnly")]
    public async Task<IActionResult> GetInvoices()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var invoices = await _invoiceReceiptService.GetUserInvoicesAsync(userId);
        return Ok(invoices);
    }

    [HttpGet("receipts")]
    [Authorize(Policy = "FarmerOnly")]
    public async Task<IActionResult> GetReceipts()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var receipts = await _invoiceReceiptService.GetUserReceiptsAsync(userId);
        return Ok(receipts);
    }

    [HttpGet("invoice/{id}")]
    [Authorize(Policy = "DealerOnly")]
    public async Task<IActionResult> GetInvoice(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var invoice = await _invoiceReceiptService.GetInvoiceByIdAsync(id, userId);
        return invoice == null ? NotFound() : Ok(invoice);
    }

    [HttpGet("receipt/{id}")]
    [Authorize(Policy = "FarmerOnly")]
    public async Task<IActionResult> GetReceipt(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var receipt = await _invoiceReceiptService.GetReceiptByIdAsync(id, userId);
        return receipt == null ? NotFound() : Ok(receipt);
    }
}