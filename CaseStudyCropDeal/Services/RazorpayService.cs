using Razorpay.Api;
using CaseStudyCropDeal.Models.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace CaseStudyCropDeal.Services;

public interface IRazorpayService
{
    RazorpayOrderResponse CreateOrder(decimal amount, string receipt);
    bool VerifySignature(string razorpayOrderId, string razorpayPaymentId, string razorpaySignature);
}

public class RazorpayService : IRazorpayService
{
    private readonly string _keyId;
    private readonly string _keySecret;

    public RazorpayService(IConfiguration configuration)
    {
        _keyId = configuration["Razorpay:KeyId"]!;
        _keySecret = configuration["Razorpay:KeySecret"]!;
    }

    public RazorpayOrderResponse CreateOrder(decimal amount, string receipt)
    {
        var client = new RazorpayClient(_keyId, _keySecret);
        var options = new Dictionary<string, object>
        {
            { "amount", (int)(amount * 100) }, // paise
            { "currency", "INR" },
            { "receipt", receipt }
        };
        var order = client.Order.Create(options);
        return new RazorpayOrderResponse
        {
            OrderId = order["id"].ToString(),
            Amount = amount,
            Currency = "INR",
            KeyId = _keyId
        };
    }

    public bool VerifySignature(string razorpayOrderId, string razorpayPaymentId, string razorpaySignature)
    {
        var payload = $"{razorpayOrderId}|{razorpayPaymentId}";
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_keySecret));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        var generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();
        return generatedSignature == razorpaySignature;
    }
}
