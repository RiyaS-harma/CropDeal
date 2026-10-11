namespace CaseStudyCropDeal.Models.DTOs;

public class CreateRazorpayOrderRequest
{
    public int OrderId { get; set; }
}

public class RazorpayOrderResponse
{
    public string OrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string KeyId { get; set; } = string.Empty;
}

public class VerifyPaymentRequest
{
    public int OrderId { get; set; }
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string RazorpayPaymentId { get; set; } = string.Empty;
    public string RazorpaySignature { get; set; } = string.Empty;
}
