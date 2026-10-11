using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User?> GetUserByIdAsync(string userId)
    {
        return await _userRepository.GetUserByIdAsync(userId);
    }

    public async Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileRequest request)
    {
        return await _userRepository.UpdateUserProfileAsync(userId, request);
    }

    public async Task<FarmerDashboardResponse> GetFarmerDashboardAsync(string farmerId)
    {
        return await _userRepository.GetFarmerDashboardAsync(farmerId);
    }

    public async Task<DealerDashboardResponse> GetDealerDashboardAsync(string dealerId)
    {
        return await _userRepository.GetDealerDashboardAsync(dealerId);
    }
}