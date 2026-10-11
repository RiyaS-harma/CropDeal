namespace CaseStudyCropDeal.Models;

public class Invoice
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string DealerId { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Order Order { get; set; } = null!;
    public User Dealer { get; set; } = null!;
}