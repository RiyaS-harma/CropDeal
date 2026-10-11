using System.ComponentModel.DataAnnotations;

namespace CaseStudyCropDeal.Models.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    [MinLength(6)]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$", 
        ErrorMessage = "Password must contain uppercase, lowercase, number and special character")]

    public string Password { get; set; } = string.Empty;
    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string LastName { get; set; } = string.Empty;
    [Required]
    public UserType UserType { get; set; }
    [Phone]
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Enter 10-Digit Phone Number")]
    public string? PhoneNumber { get; set; }
}

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Otp { get; set; } = string.Empty;
    
    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}

public class UpdateProfileRequest
{
    [StringLength(50, MinimumLength = 2)]
    public string FirstName { get; set; } = string.Empty;
    [StringLength(50, MinimumLength = 2)]
    public string LastName { get; set; } = string.Empty;
    [StringLength(200)]
    public string? Address { get; set; }
    [RegularExpression(@"^\d{10}$", ErrorMessage = "Enter 10-Digit Phone Number")]
    public string? PhoneNumber { get; set; }
    [EmailAddress]
    public string? Email { get; set; }
}

public class BankDetailsRequest
{
    [Required]
    [RegularExpression(@"^\d{9,18}$", ErrorMessage = "Account number must be 9-18 digits")]
    public string BankAccountNumber { get; set; } = string.Empty;
    
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string BankName { get; set; } = string.Empty;
    [StringLength(100)]
    public string? BankBranch { get; set; }
    [RegularExpression(@"^[A-Z]{4}0[A-Z0-9]{6}$", ErrorMessage = "Invalid IFSC code format")]
    public string? IFSCCode { get; set; }
}

public class SubscriptionRequest
{
    public string CropType { get; set; } = string.Empty;
    public string CropName { get; set; } = string.Empty;
    public string? Location { get; set; }
}

public class CreateCropRequest
{
    [Required]
    [StringLength(50)]
    public string CropType { get; set; } = string.Empty;
    [Required]
    [StringLength(100)]
    public string CropName { get; set; } = string.Empty;
    [Required]
    [Range(0.01, 999999.99, ErrorMessage = "Quantity must be greater than 0")]
    public decimal Quantity { get; set; }
    [Required]
    [StringLength(20)]
    public string Unit { get; set; } = string.Empty;
    [Required]
    [Range(0.01, 999999.99, ErrorMessage = "Price must be greater than 0")]
    public decimal PricePerUnit { get; set; }
    [Required]
    [StringLength(200)]
    public string Location { get; set; } = string.Empty;
    [StringLength(500)]
    public string Description { get; set; } = string.Empty;
    [StringLength(500)]
    public string? ImageUrl { get; set; }
}

public class UpdateCropRequest
{
    public string CropType { get; set; } = string.Empty;
    public string CropName { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal PricePerUnit { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class CreateOrderRequest
{
    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid crop ID")]
    public int CropId { get; set; }
    [Required]
    [Range(0.01, 999999.99, ErrorMessage = "Quantity must be greater than 0")]
    public decimal Quantity { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserType UserType { get; set; }
    public DateTime Expires { get; set; }
}