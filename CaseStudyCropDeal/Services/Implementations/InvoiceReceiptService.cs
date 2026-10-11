using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class InvoiceReceiptService : IInvoiceReceiptService
{
    private readonly IInvoiceReceiptRepository _invoiceReceiptRepository;

    public InvoiceReceiptService(IInvoiceReceiptRepository invoiceReceiptRepository)
    {
        _invoiceReceiptRepository = invoiceReceiptRepository;
    }

    public async Task<IEnumerable<Invoice>> GetUserInvoicesAsync(string dealerId)
    {
        return await _invoiceReceiptRepository.GetUserInvoicesAsync(dealerId);
    }

    public async Task<IEnumerable<Receipt>> GetUserReceiptsAsync(string farmerId)
    {
        return await _invoiceReceiptRepository.GetUserReceiptsAsync(farmerId);
    }

    public async Task<Invoice?> GetInvoiceByIdAsync(int id, string dealerId)
    {
        return await _invoiceReceiptRepository.GetInvoiceByIdAsync(id, dealerId);
    }

    public async Task<Receipt?> GetReceiptByIdAsync(int id, string farmerId)
    {
        return await _invoiceReceiptRepository.GetReceiptByIdAsync(id, farmerId);
    }
}