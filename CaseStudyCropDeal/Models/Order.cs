namespace CaseStudyCropDeal.Models;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public int CropId { get; set; }
    public string FarmerId { get; set; } = string.Empty;
    public string DealerId { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal PricePerUnit { get; set; }
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    
    public Crop Crop { get; set; } = null!;
    public User Farmer { get; set; } = null!;
    public User Dealer { get; set; } = null!;
}

public enum OrderStatus
{
    Pending = 1,
    Confirmed = 2,
    Completed = 3,
    Cancelled = 4
}