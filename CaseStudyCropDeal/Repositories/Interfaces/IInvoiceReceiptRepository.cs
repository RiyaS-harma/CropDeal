using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Repositories.Interfaces;

public interface IInvoiceReceiptRepository
{
    Task<IEnumerable<Invoice>> GetUserInvoicesAsync(string dealerId);
    Task<IEnumerable<Receipt>> GetUserReceiptsAsync(string farmerId);
    Task<Invoice?> GetInvoiceByIdAsync(int id, string dealerId);
    Task<Receipt?> GetReceiptByIdAsync(int id, string farmerId);
}