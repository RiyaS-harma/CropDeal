using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;

namespace CaseStudyCropDeal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BankAccountController : ControllerBase
{
    private readonly UserManager<User> _userManager;

    public BankAccountController(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    [HttpPost]
    public async Task<IActionResult> AddBankAccount(BankDetailsRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound("User not found");

        // Check if user is farmer or dealer
        if (user.UserType != UserType.Farmer && user.UserType != UserType.Dealer)
            return BadRequest("Only farmers and dealers can add bank details");

        // Check if bank details already exist
        if (!string.IsNullOrEmpty(user.BankAccountNumber))
            return BadRequest("Bank account already exists. Use PUT to update.");

        user.BankAccountNumber = request.BankAccountNumber;
        user.BankName = request.BankName;
        
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "Bank account added successfully" });
    }

    [HttpGet]
    public async Task<IActionResult> GetBankAccount()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound("User not found");

        if (string.IsNullOrEmpty(user.BankAccountNumber))
            return NotFound("No bank account found");

        return Ok(new {
            BankAccountNumber = user.BankAccountNumber,
            BankName = user.BankName
        });
    }

    [HttpPut]
    public async Task<IActionResult> UpdateBankAccount(BankDetailsRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound("User not found");

        if (string.IsNullOrEmpty(user.BankAccountNumber))
            return NotFound("No bank account found to update");

        user.BankAccountNumber = request.BankAccountNumber;
        user.BankName = request.BankName;
        
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "Bank account updated successfully" });
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteBankAccount()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)!.Value;
        var user = await _userManager.FindByIdAsync(userId);
        
        if (user == null)
            return NotFound("User not found");

        if (string.IsNullOrEmpty(user.BankAccountNumber))
            return NotFound("No bank account found to delete");

        user.BankAccountNumber = null;
        user.BankName = null;
        
        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        return Ok(new { Message = "Bank account deleted successfully" });
    }
}