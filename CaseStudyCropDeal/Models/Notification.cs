namespace CaseStudyCropDeal.Models;

public class Notification
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public User User { get; set; } = null!;
}

public enum NotificationType
{
    CropAvailable = 1,
    CropAddedToCart = 2,
    OrderPlaced = 3,
    OrderConfirmed = 4,
    TransactionCompleted = 5
}