namespace CaseStudyCropDeal.Models;

public class CartItem
{
    public int Id { get; set; }
    public string DealerId { get; set; } = string.Empty;
    public int CropId { get; set; }
    public decimal Quantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public User Dealer { get; set; } = null!;
    public Crop Crop { get; set; } = null!;
}