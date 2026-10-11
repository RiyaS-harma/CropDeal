using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class CropSubscriptionService : ICropSubscriptionService
{
    private readonly ICropSubscriptionRepository _cropSubscriptionRepository;

    public CropSubscriptionService(ICropSubscriptionRepository cropSubscriptionRepository)
    {
        _cropSubscriptionRepository = cropSubscriptionRepository;
    }

    public async Task<CropSubscription> CreateSubscriptionAsync(SubscriptionRequest request, string dealerId)
    {
        return await _cropSubscriptionRepository.CreateSubscriptionAsync(request, dealerId);
    }

    public async Task<IEnumerable<CropSubscription>> GetSubscriptionsAsync(string dealerId)
    {
        return await _cropSubscriptionRepository.GetSubscriptionsAsync(dealerId);
    }

    public async Task<bool> DeleteSubscriptionAsync(int id, string dealerId)
    {
        return await _cropSubscriptionRepository.DeleteSubscriptionAsync(id, dealerId);
    }
}