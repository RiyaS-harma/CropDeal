namespace CaseStudyCropDeal.Models;

public class RatingReview
{
    public int Id { get; set; }
    public string ReviewerId { get; set; } = string.Empty;
    public string RevieweeId { get; set; } = string.Empty;
    public int OrderId { get; set; }
    public int Rating { get; set; }
    public string? Review { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public User Reviewer { get; set; } = null!;
    public User Reviewee { get; set; } = null!;
    public Order Order { get; set; } = null!;
}