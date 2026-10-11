using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;

namespace CaseStudyCropDeal.Repositories.Implementations;

public class BankAccountRepository : IBankAccountRepository
{
    private readonly ApplicationDbContext _context;

    public BankAccountRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<BankAccount> CreateBankAccountAsync(BankDetailsRequest request, string userId)
    {
        var bankAccount = new BankAccount
        {
            UserId = userId,
            BankAccountNumber = request.BankAccountNumber,
            BankName = request.BankName,
            BankBranch = request.BankBranch,
            IFSCCode = request.IFSCCode
        };

        _context.BankAccounts.Add(bankAccount);
        await _context.SaveChangesAsync();
        return bankAccount;
    }

    public async Task<IEnumerable<BankAccount>> GetUserBankAccountsAsync(string userId)
    {
        return await _context.BankAccounts
            .Where(b => b.UserId == userId)
            .ToListAsync();
    }

    public async Task<BankAccount?> UpdateBankAccountAsync(int id, BankDetailsRequest request, string userId)
    {
        var bankAccount = await _context.BankAccounts
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        
        if (bankAccount == null) return null;

        bankAccount.BankAccountNumber = request.BankAccountNumber;
        bankAccount.BankName = request.BankName;
        bankAccount.BankBranch = request.BankBranch;
        bankAccount.IFSCCode = request.IFSCCode;

        await _context.SaveChangesAsync();
        return bankAccount;
    }

    public async Task<bool> DeleteBankAccountAsync(int id, string userId)
    {
        var bankAccount = await _context.BankAccounts
            .FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        
        if (bankAccount == null) return false;

        _context.BankAccounts.Remove(bankAccount);
        await _context.SaveChangesAsync();
        return true;
    }
}