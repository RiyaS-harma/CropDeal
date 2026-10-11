using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("health")]
    [AllowAnonymous]
    public IActionResult Health() => Ok(new { status = "healthy" });

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var user = await _userService.GetUserByIdAsync(userId);
        return Ok(user);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var result = await _userService.UpdateUserProfileAsync(userId, request);
        
        if (!result)
            return NotFound("User not found");
            
        return Ok("Profile updated successfully");
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var user = await _userService.GetUserByIdAsync(userId);
        
        if (user == null)
            return NotFound("User not found");
        
        if (user.UserType == UserType.Farmer)
        {
            var farmerDashboard = await _userService.GetFarmerDashboardAsync(userId);
            return Ok(farmerDashboard);
        }
        else if (user.UserType == UserType.Dealer)
        {
            var dealerDashboard = await _userService.GetDealerDashboardAsync(userId);
            return Ok(dealerDashboard);
        }
        
        return BadRequest("Invalid user type");
    }
}