using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;

    public AdminController(ApplicationDbContext context, UserManager<User> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // FARMER MANAGEMENT
    [HttpGet("farmers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllFarmers()
    {
        var farmers = await _userManager.Users
            .Where(u => u.UserType == UserType.Farmer)
            .ToListAsync();
        return Ok(farmers);
    }

    [HttpPut("farmers/{id}/profile")]
    public async Task<IActionResult> EditFarmerProfile(string id, UpdateProfileRequest request)
    {
        var farmer = await _userManager.FindByIdAsync(id);
        if (farmer == null || farmer.UserType != UserType.Farmer)
            return NotFound("Farmer not found");

        farmer.FirstName = request.FirstName;
        farmer.LastName = request.LastName;
        farmer.Address = request.Address;
        farmer.PhoneNumber = request.PhoneNumber;

        await _userManager.UpdateAsync(farmer);
        return Ok(new { Message = "Farmer profile updated" });
    }

    [HttpPut("farmers/{id}/toggle-status")]
    public async Task<IActionResult> ToggleFarmerStatus(string id)
    {
        var farmer = await _userManager.FindByIdAsync(id);
        if (farmer == null || farmer.UserType != UserType.Farmer)
            return NotFound("Farmer not found");

        farmer.IsActive = !farmer.IsActive;
        await _userManager.UpdateAsync(farmer);
        return Ok(new { Message = $"Farmer {(farmer.IsActive ? "activated" : "deactivated")}" });
    }

    // DEALER MANAGEMENT
    [HttpGet("dealers")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllDealers()
    {
        var dealers = await _userManager.Users
            .Where(u => u.UserType == UserType.Dealer)
            .ToListAsync();
        return Ok(dealers);
    }

    [HttpPost("dealers")]
    public async Task<IActionResult> AddDealer(RegisterRequest request)
    {
        var dealer = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            UserType = UserType.Dealer
        };

        var result = await _userManager.CreateAsync(dealer, request.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "Dealer added successfully", DealerId = dealer.Id });
    }

    [HttpPut("dealers/{id}/profile")]
    public async Task<IActionResult> EditDealerProfile(string id, UpdateProfileRequest request)
    {
        var dealer = await _userManager.FindByIdAsync(id);
        if (dealer == null || dealer.UserType != UserType.Dealer)
            return NotFound("Dealer not found");

        dealer.FirstName = request.FirstName;
        dealer.LastName = request.LastName;
        dealer.Address = request.Address;
        dealer.PhoneNumber = request.PhoneNumber;

        await _userManager.UpdateAsync(dealer);
        return Ok(new { Message = "Dealer profile updated" });
    }

    [HttpPut("dealers/{id}/toggle-status")]
    public async Task<IActionResult> ToggleDealerStatus(string id)
    {
        var dealer = await _userManager.FindByIdAsync(id);
        if (dealer == null || dealer.UserType != UserType.Dealer)
            return NotFound("Dealer not found");

        dealer.IsActive = !dealer.IsActive;
        await _userManager.UpdateAsync(dealer);
        return Ok(new { Message = $"Dealer {(dealer.IsActive ? "activated" : "deactivated")}" });
    }

    [HttpGet("dealers/{id}/ratings")]
    public async Task<IActionResult> GetDealerRatings(string id)
    {
        var ratings = await _context.RatingReviews
            .Include(r => r.Reviewee)
            .Where(r => r.ReviewerId == id)
            .ToListAsync();
        return Ok(ratings);
    }

    [HttpGet("dealers/export")]
    public async Task<IActionResult> ExportDealerReport()
    {
        var dealers = await _userManager.Users
            .Where(u => u.UserType == UserType.Dealer)
            .ToListAsync();

        var csv = "Id,Email,FirstName,LastName,IsActive,CreatedAt\n";
        csv += string.Join("\n", dealers.Select(d => 
            $"{d.Id},{d.Email},{d.FirstName},{d.LastName},{d.IsActive},{d.CreatedAt}"));

        return File(System.Text.Encoding.UTF8.GetBytes(csv), "text/csv", "dealers_report.csv");
    }

    // GENERAL USER MANAGEMENT
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userManager.Users.ToListAsync();
        return Ok(users);
    }

    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null) return NotFound();

        await _userManager.DeleteAsync(user);
        return Ok(new { Message = "User deleted successfully" });
    }

    // CROP MANAGEMENT
    [HttpGet("crops")]
    public async Task<IActionResult> GetAllCrops()
    {
        var crops = await _context.Crops
            .Include(c => c.Farmer)
            .ToListAsync();
        return Ok(crops);
    }

    [HttpDelete("crops/{id}")]
    public async Task<IActionResult> DeleteCrop(int id)
    {
        var crop = await _context.Crops.FindAsync(id);
        if (crop == null) return NotFound();

        _context.Crops.Remove(crop);
        await _context.SaveChangesAsync();
        return Ok(new { Message = "Crop deleted successfully" });
    }

    // ORDER MANAGEMENT
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Crop)
            .Include(o => o.Farmer)
            .Include(o => o.Dealer)
            .ToListAsync();
        return Ok(orders);
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        if (Enum.TryParse<OrderStatus>(status, out var orderStatus))
        {
            order.Status = orderStatus;
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Order status updated" });
        }

        return BadRequest("Invalid status");
    }

    // REPORT MANAGEMENT
    [HttpGet("reports/summary")]
    public async Task<IActionResult> GetSummaryReport()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var totalFarmers = await _userManager.Users.CountAsync(u => u.UserType == UserType.Farmer);
        var totalDealers = await _userManager.Users.CountAsync(u => u.UserType == UserType.Dealer);
        var totalCrops = await _context.Crops.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);

        return Ok(new {
            TotalUsers = totalUsers,
            TotalFarmers = totalFarmers,
            TotalDealers = totalDealers,
            TotalCrops = totalCrops,
            TotalOrders = totalOrders,
            TotalRevenue = totalRevenue
        });
    }

    [HttpGet("reports/orders")]
    public async Task<IActionResult> GetOrderReports(
        string? orderNumber = null,
        OrderStatus? status = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        var query = _context.Orders
            .Include(o => o.Crop)
            .Include(o => o.Farmer)
            .Include(o => o.Dealer)
            .AsQueryable();

        if (!string.IsNullOrEmpty(orderNumber))
            query = query.Where(o => o.OrderNumber.Contains(orderNumber));

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);

        if (fromDate.HasValue)
            query = query.Where(o => o.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(o => o.CreatedAt <= toDate.Value);

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return Ok(orders);
    }

    [HttpGet("reports/advanced")]
    public async Task<IActionResult> GetAdvancedReports(
        string? businessType = null,
        string? location = null,
        DateTime? fromDate = null,
        DateTime? toDate = null)
    {
        var query = from o in _context.Orders
                    join c in _context.Crops on o.CropId equals c.Id
                    join f in _context.Users on o.FarmerId equals f.Id
                    join d in _context.Users on o.DealerId equals d.Id
                    select new {
                        OrderId = o.Id,
                        OrderNumber = o.OrderNumber,
                        CropName = c.CropName,
                        CropType = c.CropType,
                        Location = c.Location,
                        FarmerName = f.FirstName + " " + f.LastName,
                        DealerName = d.FirstName + " " + d.LastName,
                        TotalAmount = o.TotalAmount,
                        Status = o.Status,
                        CreatedAt = o.CreatedAt
                    };

        if (!string.IsNullOrEmpty(businessType))
            query = query.Where(x => x.CropType.Contains(businessType));

        if (!string.IsNullOrEmpty(location))
            query = query.Where(x => x.Location.Contains(location));

        if (fromDate.HasValue)
            query = query.Where(x => x.CreatedAt >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(x => x.CreatedAt <= toDate.Value);

        var reports = await query.ToListAsync();
        return Ok(reports);
    }
}