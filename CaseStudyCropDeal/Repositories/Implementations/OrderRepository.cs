using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public OrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, string dealerId)
    {
        var crop = await _context.Crops.FindAsync(request.CropId);
        if (crop == null) throw new ArgumentException("Crop not found");
        if (crop.Status != CropStatus.Available) throw new InvalidOperationException("Crop not available");
        if (request.Quantity > crop.Quantity) throw new InvalidOperationException("Insufficient quantity");

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}",
            CropId = request.CropId,
            FarmerId = crop.FarmerId,
            DealerId = dealerId,
            Quantity = request.Quantity,
            PricePerUnit = crop.PricePerUnit,
            TotalAmount = request.Quantity * crop.PricePerUnit
        };
        
        _context.Orders.Add(order);
        crop.Quantity -= request.Quantity;
        if (crop.Quantity == 0) crop.Status = CropStatus.Sold;
        await _context.SaveChangesAsync();
        return order;
    }

    public async Task<Order?> GetOrderByIdAsync(int id, string userId)
    {
        return await _context.Orders
            .Include(o => o.Crop)
            .FirstOrDefaultAsync(o => o.Id == id && (o.FarmerId == userId || o.DealerId == userId));
    }

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(string userId)
    {
        return await _context.Orders
            .Include(o => o.Crop)
            .Include(o => o.Farmer)
            .Include(o => o.Dealer)
            .Where(o => o.FarmerId == userId || o.DealerId == userId)
            .ToListAsync();
    }

    public async Task<bool> ConfirmOrderAsync(int id, string farmerId)
    {
        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id && o.FarmerId == farmerId);
        if (order == null) return false;
        
        order.Status = OrderStatus.Confirmed;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CompleteOrderAsync(int id, string dealerId)
    {
        var order = await _context.Orders.Include(o => o.Crop)
            .FirstOrDefaultAsync(o => o.Id == id && o.DealerId == dealerId);
        if (order == null) return false;
        
        order.Status = OrderStatus.Completed;
        order.CompletedAt = DateTime.UtcNow;

        // Generate Invoice for dealer
        var invoiceExists = await _context.Invoices.AnyAsync(i => i.OrderId == id);
        if (!invoiceExists)
        {
            _context.Invoices.Add(new Invoice
            {
                OrderId = order.Id,
                DealerId = order.DealerId,
                TotalAmount = order.TotalAmount,
                CreatedAt = DateTime.UtcNow
            });
        }

        // Generate Receipt for farmer
        var receiptExists = await _context.Receipts.AnyAsync(r => r.OrderId == id);
        if (!receiptExists)
        {
            _context.Receipts.Add(new Receipt
            {
                OrderId = order.Id,
                FarmerId = order.FarmerId,
                TotalAmount = order.TotalAmount,
                CreatedAt = DateTime.UtcNow
            });
        }

        await _context.SaveChangesAsync();
        return true;
    }
}