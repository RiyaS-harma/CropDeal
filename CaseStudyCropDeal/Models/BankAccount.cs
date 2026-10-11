namespace CaseStudyCropDeal.Models;

public class BankAccount
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string BankAccountNumber { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string? BankBranch { get; set; }
    public string? IFSCCode { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public User User { get; set; } = null!;
}