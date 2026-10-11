namespace CaseStudyCropDeal.Models.DTOs;

public class FarmerDashboardResponse
{
    public int TotalCrops { get; set; }
    public int ActiveCrops { get; set; }
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public decimal TotalEarnings { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
}

public class DealerDashboardResponse
{
    public int TotalOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int PendingOrders { get; set; }
    public decimal TotalSpent { get; set; }
    public double AverageRating { get; set; }
    public int TotalReviews { get; set; }
}