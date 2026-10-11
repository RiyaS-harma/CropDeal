using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class BankAccountService : IBankAccountService
{
    private readonly IBankAccountRepository _bankAccountRepository;

    public BankAccountService(IBankAccountRepository bankAccountRepository)
    {
        _bankAccountRepository = bankAccountRepository;
    }

    public async Task<BankAccount> CreateBankAccountAsync(BankDetailsRequest request, string userId)
    {
        return await _bankAccountRepository.CreateBankAccountAsync(request, userId);
    }

    public async Task<IEnumerable<BankAccount>> GetUserBankAccountsAsync(string userId)
    {
        return await _bankAccountRepository.GetUserBankAccountsAsync(userId);
    }

    public async Task<BankAccount?> UpdateBankAccountAsync(int id, BankDetailsRequest request, string userId)
    {
        return await _bankAccountRepository.UpdateBankAccountAsync(id, request, userId);
    }

    public async Task<bool> DeleteBankAccountAsync(int id, string userId)
    {
        return await _bankAccountRepository.DeleteBankAccountAsync(id, userId);
    }
}