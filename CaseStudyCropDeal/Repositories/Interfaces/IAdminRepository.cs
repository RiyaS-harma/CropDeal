using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Repositories.Interfaces;

public interface IAdminRepository
{
    Task<IEnumerable<User>> GetAllFarmersAsync();
    Task<IEnumerable<User>> GetAllDealersAsync();
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<IEnumerable<Crop>> GetAllCropsAsync();
    Task<IEnumerable<Order>> GetAllOrdersAsync();
    Task<object> GetSummaryReportAsync();
    Task<User?> GetUserByIdAsync(string userId);
    Task<bool> UpdateUserAsync(User user);
    Task<bool> DeleteUserAsync(User user);
    Task<bool> DeleteCropAsync(int cropId);
    Task<Order?> GetOrderByIdAsync(int orderId);
    Task<bool> UpdateOrderAsync(Order order);
}