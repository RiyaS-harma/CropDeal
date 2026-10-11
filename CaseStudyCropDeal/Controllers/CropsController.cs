using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Services.Interfaces;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Services;
using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CropsController : ControllerBase
{
    private readonly ICropService _cropService;
    private readonly IEmailService _emailService;
    private readonly ApplicationDbContext _context;

    public CropsController(ICropService cropService, IEmailService emailService, ApplicationDbContext context)
    {
        _cropService = cropService;
        _emailService = emailService;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCrops()
    {
        var crops = await _cropService.GetAvailableCropsAsync();
        return Ok(crops);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCrop(int id)
    {
        var crop = await _cropService.GetCropByIdAsync(id);
        return crop == null ? NotFound() : Ok(crop);
    }

    [HttpPost]
    [Authorize(Policy = "FarmerOnly")]
    public async Task<IActionResult> CreateCrop(CreateCropRequest request)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var crop = await _cropService.CreateCropAsync(request, userId);
        
        // Send email notifications to all dealers
        var farmer = await _context.Users.FindAsync(userId);
        var dealers = await _context.Users.Where(u => u.UserType == UserType.Dealer).ToListAsync();
        
        foreach (var dealer in dealers)
        {
            if (!string.IsNullOrEmpty(dealer.Email))
            {
                await _emailService.SendNewCropNotificationAsync(
                    dealer.Email,
                    request.CropName,
                    $"{farmer?.FirstName} {farmer?.LastName}",
                    request.PricePerUnit,
                    request.Location
                );
            }
        }
        
        return CreatedAtAction(nameof(GetCrop), new { id = crop.Id }, crop);
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "FarmerOnly")]
    public async Task<IActionResult> UpdateCrop(int id, UpdateCropRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var crop = await _cropService.UpdateCropAsync(id, request, userId);
        return crop == null ? NotFound() : Ok(crop);
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "FarmerOnly")]
    public async Task<IActionResult> DeleteCrop(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var success = await _cropService.DeleteCropAsync(id, userId);
        return success ? Ok(new { Message = "Crop deleted successfully" }) : NotFound();
    }

    [HttpGet("my-crops")]
    [Authorize(Policy = "FarmerOnly")]
    public async Task<IActionResult> GetMyCrops()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var crops = await _cropService.GetFarmerCropsAsync(userId);
        return Ok(crops);
    }

    [HttpGet("search")]
    [Authorize(Policy = "DealerOnly")]
    public async Task<IActionResult> SearchCrops(string? cropName = null, decimal? maxPrice = null, string? location = null)
    {
        var crops = await _cropService.SearchCropsAsync(cropName, maxPrice, location);
        return Ok(crops);
    }
}