using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class InvoiceReceiptRepository : IInvoiceReceiptRepository
{
    private readonly ApplicationDbContext _context;

    public InvoiceReceiptRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Invoice>> GetUserInvoicesAsync(string dealerId)
    {
        return await _context.Invoices
            .Include(i => i.Order)
                .ThenInclude(o => o.Crop)
            .Where(i => i.DealerId == dealerId)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Receipt>> GetUserReceiptsAsync(string farmerId)
    {
        return await _context.Receipts
            .Include(r => r.Order)
                .ThenInclude(o => o.Crop)
            .Where(r => r.FarmerId == farmerId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Invoice?> GetInvoiceByIdAsync(int id, string dealerId)
    {
        return await _context.Invoices
            .Include(i => i.Order)
                .ThenInclude(o => o.Crop)
            .FirstOrDefaultAsync(i => i.Id == id && i.DealerId == dealerId);
    }

    public async Task<Receipt?> GetReceiptByIdAsync(int id, string farmerId)
    {
        return await _context.Receipts
            .Include(r => r.Order)
                .ThenInclude(o => o.Crop)
            .FirstOrDefaultAsync(r => r.Id == id && r.FarmerId == farmerId);
    }
}