using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;

namespace CaseStudyCropDeal.Repositories.Interfaces;

public interface ICropRepository
{
    Task<IEnumerable<Crop>> GetAvailableCropsAsync();
    Task<Crop?> GetCropByIdAsync(int id);
    Task<Crop> CreateCropAsync(CreateCropRequest request, string farmerId);
    Task<Crop?> UpdateCropAsync(int id, UpdateCropRequest request, string farmerId);
    Task<bool> DeleteCropAsync(int id, string farmerId);
    Task<IEnumerable<Crop>> GetFarmerCropsAsync(string farmerId);
    Task<IEnumerable<Crop>> SearchCropsAsync(string? cropName, decimal? maxPrice, string? location);
}

public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(CreateOrderRequest request, string dealerId);
    Task<Order?> GetOrderByIdAsync(int id, string userId);
    Task<IEnumerable<Order>> GetUserOrdersAsync(string userId);
    Task<bool> ConfirmOrderAsync(int id, string farmerId);
    Task<bool> CompleteOrderAsync(int id, string dealerId);
}

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(string userId);
    Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileRequest request);
    Task<FarmerDashboardResponse> GetFarmerDashboardAsync(string farmerId);
    Task<DealerDashboardResponse> GetDealerDashboardAsync(string dealerId);
}

public interface IBankAccountRepository
{
    Task<BankAccount> CreateBankAccountAsync(BankDetailsRequest request, string userId);
    Task<IEnumerable<BankAccount>> GetUserBankAccountsAsync(string userId);
    Task<BankAccount?> UpdateBankAccountAsync(int id, BankDetailsRequest request, string userId);
    Task<bool> DeleteBankAccountAsync(int id, string userId);
}

public interface ICartItemRepository
{
    Task<CartItem> AddToCartAsync(int cropId, decimal quantity, string dealerId);
    Task<IEnumerable<CartItem>> GetCartItemsAsync(string dealerId);
    Task<CartItem?> UpdateCartItemAsync(int id, decimal quantity, string dealerId);
    Task<bool> RemoveFromCartAsync(int id, string dealerId);
}

public interface ICropSubscriptionRepository
{
    Task<CropSubscription> CreateSubscriptionAsync(SubscriptionRequest request, string dealerId);
    Task<IEnumerable<CropSubscription>> GetSubscriptionsAsync(string dealerId);
    Task<bool> DeleteSubscriptionAsync(int id, string dealerId);
}

public interface ITransactionRepository
{
    Task<Transaction> ProcessPaymentAsync(int orderId, string paymentMethod, string dealerId);
    Task<IEnumerable<Transaction>> GetTransactionHistoryAsync(string userId);
    Task<Transaction?> GetTransactionByIdAsync(int id, string userId);
}