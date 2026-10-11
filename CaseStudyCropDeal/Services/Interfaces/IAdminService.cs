using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;

namespace CaseStudyCropDeal.Services.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<User>> GetAllFarmersAsync();
    Task<IEnumerable<User>> GetAllDealersAsync();
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<IEnumerable<Crop>> GetAllCropsAsync();
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    Task<object> GetSummaryReportAsync();
    Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileRequest request);
    Task<bool> ToggleUserStatusAsync(string userId);
    Task<bool> DeleteUserAsync(string userId);
    Task<bool> DeleteCropAsync(int cropId);
    Task<bool> UpdateOrderStatusAsync(int orderId, OrderStatus status);
}