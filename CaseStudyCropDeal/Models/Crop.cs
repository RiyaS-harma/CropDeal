namespace CaseStudyCropDeal.Models;

public class Crop
{
    public int Id { get; set; }
    public string FarmerId { get; set; } = string.Empty;
    public string CropType { get; set; } = string.Empty;
    public string CropName { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal PricePerUnit { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public CropStatus Status { get; set; } = CropStatus.Available;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public User Farmer { get; set; } = null!;
}

public enum CropStatus
{
    Available = 1,
    Sold = 2,
    Reserved = 3
}