using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Services;
using System.Collections.Concurrent;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;

    // email -> (otp, expiry)
    private static readonly ConcurrentDictionary<string, (string Otp, DateTime Expiry)> _otpStore = new();

    public AuthController(UserManager<User> userManager, SignInManager<User> signInManager, IJwtService jwtService, IEmailService emailService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (!ModelState.IsValid)
        return BadRequest(ModelState);

        if (request.UserType == UserType.Admin)
        return BadRequest("Admin registration is not allowed");

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserType = request.UserType,
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            UserType = user.UserType,
            Expires = DateTime.UtcNow.AddHours(24)
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        if (!ModelState.IsValid)
        return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Unauthorized("Invalid credentials");

        if (!user.IsActive)
            return Unauthorized("Your account has been deactivated by the admin. Please contact support.");

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
            return Unauthorized("Invalid credentials");

        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            Email = user.Email!,
            UserType = user.UserType,
            Expires = DateTime.UtcNow.AddHours(24)
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Ok(new { Message = "If email exists, OTP has been sent" });

        var otp = new Random().Next(100000, 999999).ToString();
        _otpStore[request.Email] = (otp, DateTime.UtcNow.AddMinutes(10));

        try
        {
            await _emailService.SendPasswordResetOtpAsync(request.Email, otp);
            return Ok(new { Message = "OTP sent to your email" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email error: {ex.Message}");
            return StatusCode(500, new { Message = "Failed to send OTP" });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!_otpStore.TryGetValue(request.Email, out var entry))
            return BadRequest("OTP not found or expired");

        if (entry.Otp != request.Otp || DateTime.UtcNow > entry.Expiry)
        {
            _otpStore.TryRemove(request.Email, out _);
            return BadRequest("Invalid or expired OTP");
        }

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return BadRequest("Invalid request");

        var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
        var result = await _userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        _otpStore.TryRemove(request.Email, out _);
        return Ok(new { Message = "Password reset successfully" });
    }
}