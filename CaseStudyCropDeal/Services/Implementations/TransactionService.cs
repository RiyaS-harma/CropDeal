using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;

    public TransactionService(ITransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public async Task<Transaction> ProcessPaymentAsync(int orderId, string paymentMethod, string dealerId)
    {
        return await _transactionRepository.ProcessPaymentAsync(orderId, paymentMethod, dealerId);
    }

    public async Task<IEnumerable<Transaction>> GetTransactionHistoryAsync(string userId)
    {
        return await _transactionRepository.GetTransactionHistoryAsync(userId);
    }

    public async Task<Transaction?> GetTransactionByIdAsync(int id, string userId)
    {
        return await _transactionRepository.GetTransactionByIdAsync(id, userId);
    }
}