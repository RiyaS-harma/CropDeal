using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction> ProcessPaymentAsync(int orderId, string paymentMethod, string dealerId)
    {
        var order = await _context.Orders
            .Include(o => o.Crop)
            .FirstOrDefaultAsync(o => o.Id == orderId && o.DealerId == dealerId &&
                (o.Status == OrderStatus.Confirmed || o.Status == OrderStatus.Completed));
        if (order == null) throw new ArgumentException("Order not found, unauthorized, or not confirmed by farmer");

        // Idempotency: return existing transaction if already processed
        var existingTransaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.OrderId == orderId && t.Status == TransactionStatus.Completed);
        if (existingTransaction != null) return existingTransaction;

        var transaction = new Transaction
        {
            TransactionId = Guid.NewGuid().ToString(),
            OrderId = orderId,
            Amount = order.TotalAmount,
            PaymentMethod = paymentMethod,
            Status = TransactionStatus.Completed
        };
        _context.Transactions.Add(transaction);

        order.Status = OrderStatus.Completed;
        order.CompletedAt = DateTime.UtcNow;

        if (!await _context.Invoices.AnyAsync(i => i.OrderId == orderId))
            _context.Invoices.Add(new Invoice { OrderId = orderId, DealerId = dealerId, TotalAmount = order.TotalAmount });

        if (!await _context.Receipts.AnyAsync(r => r.OrderId == orderId))
            _context.Receipts.Add(new Receipt { OrderId = orderId, FarmerId = order.FarmerId, TotalAmount = order.TotalAmount });

        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<IEnumerable<Transaction>> GetTransactionHistoryAsync(string userId)
    {
        return await _context.Transactions
            .Include(t => t.Order)
            .Where(t => t.Order.FarmerId == userId || t.Order.DealerId == userId)
            .ToListAsync();
    }

    public async Task<Transaction?> GetTransactionByIdAsync(int id, string userId)
    {
        return await _context.Transactions
            .Include(t => t.Order)
            .FirstOrDefaultAsync(t => t.Id == id && (t.Order.FarmerId == userId || t.Order.DealerId == userId));
    }
}