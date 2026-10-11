namespace CaseStudyCropDeal.Models;

public class Receipt
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public string FarmerId { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public Order Order { get; set; } = null!;
    public User Farmer { get; set; } = null!;
}