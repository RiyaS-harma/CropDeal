using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class AdminService : IAdminService
{
    private readonly IAdminRepository _adminRepository;

    public AdminService(IAdminRepository adminRepository)
    {
        _adminRepository = adminRepository;
    }

    public async Task<IEnumerable<User>> GetAllFarmersAsync()
    {
        return await _adminRepository.GetAllFarmersAsync();
    }

    public async Task<IEnumerable<User>> GetAllDealersAsync()
    {
        return await _adminRepository.GetAllDealersAsync();
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _adminRepository.GetAllUsersAsync();
    }

    public async Task<IEnumerable<Crop>> GetAllCropsAsync()
    {
        return await _adminRepository.GetAllCropsAsync();
    }

    public async Task<IEnumerable<Order>> GetAllOrdersAsync()
    {
        return await _adminRepository.GetAllOrdersAsync();
    }

    public async Task<object> GetSummaryReportAsync()
    {
        return await _adminRepository.GetSummaryReportAsync();
    }

    public async Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await _adminRepository.GetUserByIdAsync(userId);
        if (user == null) return false;

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.Address = request.Address;
        user.PhoneNumber = request.PhoneNumber;

        return await _adminRepository.UpdateUserAsync(user);
    }

    public async Task<bool> ToggleUserStatusAsync(string userId)
    {
        var user = await _adminRepository.GetUserByIdAsync(userId);
        if (user == null) return false;

        user.IsActive = !user.IsActive;
        return await _adminRepository.UpdateUserAsync(user);
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await _adminRepository.GetUserByIdAsync(userId);
        if (user == null) return false;

        return await _adminRepository.DeleteUserAsync(user);
    }

    public async Task<bool> DeleteCropAsync(int cropId)
    {
        return await _adminRepository.DeleteCropAsync(cropId);
    }

    public async Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status)
    {
        var order = await _adminRepository.GetOrderByIdAsync(orderId);
        if (order == null) return false;

        order.Status = status;
        return await _adminRepository.UpdateOrderAsync(order);
    }
}