namespace CaseStudyCropDeal.Services;

public interface IEmailService
{
    Task SendPasswordResetOtpAsync(string email, string otp);
    Task SendNewCropNotificationAsync(string dealerEmail, string cropName, string farmerName, decimal pricePerUnit, string location);
}