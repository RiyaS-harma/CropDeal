using System.Net;
using System.Net.Mail;

namespace CaseStudyCropDeal.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendPasswordResetOtpAsync(string email, string otp)
        {
            try
            {
                var smtpHost = _configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "noreply@cropdeal.com";
                var senderPassword = _configuration["EmailSettings:SenderPassword"] ?? "";

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(senderEmail, senderPassword)
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "CropDeal Platform"),
                    Subject = "Password Reset OTP",
                    Body = $@"
                        <h2>Password Reset OTP</h2>
                        <p>Your OTP to reset your CropDeal password is:</p>
                        <h1 style='letter-spacing:8px;color:#16a34a;'>{otp}</h1>
                        <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    ",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(email);
                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send OTP email to {email}: {ex.Message}");
                throw;
            }
        }

        public async Task SendNewCropNotificationAsync(string dealerEmail, string cropName, string farmerName, decimal pricePerUnit, string location)
        {
            try
            {
                var smtpHost = _configuration["EmailSettings:SmtpHost"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "noreply@cropdeal.com";
                var senderPassword = _configuration["EmailSettings:SenderPassword"] ?? "";

                using var client = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(senderEmail, senderPassword)
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail, "CropDeal Platform"),
                    Subject = $"New Crop Available: {cropName}",
                    Body = $@"
                        <h2>New Crop Available!</h2>
                        <p>A new crop has been added to the platform:</p>
                        <ul>
                            <li><strong>Crop:</strong> {cropName}</li>
                            <li><strong>Farmer:</strong> {farmerName}</li>
                            <li><strong>Price:</strong> ₹{pricePerUnit} per unit</li>
                            <li><strong>Location:</strong> {location}</li>
                        </ul>
                        <p>Visit the CropDeal platform to place your order!</p>
                    ",
                    IsBodyHtml = true
                };

                mailMessage.To.Add(dealerEmail);
                await client.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send crop notification email to {dealerEmail}: {ex.Message}");
            }
        }
    }
}