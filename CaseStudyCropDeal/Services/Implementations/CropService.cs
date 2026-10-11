using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class CropService : ICropService
{
    private readonly ICropRepository _cropRepository;

    public CropService(ICropRepository cropRepository)
    {
        _cropRepository = cropRepository;
    }

    public async Task<IEnumerable<Crop>> GetAvailableCropsAsync()
    {
        return await _cropRepository.GetAvailableCropsAsync();
    }

    public async Task<Crop?> GetCropByIdAsync(int id)
    {
        return await _cropRepository.GetCropByIdAsync(id);
    }

    public async Task<Crop> CreateCropAsync(CreateCropRequest request, string farmerId)
    {
        return await _cropRepository.CreateCropAsync(request, farmerId);
    }

    public async Task<Crop?> UpdateCropAsync(int id, UpdateCropRequest request, string farmerId)
    {
        return await _cropRepository.UpdateCropAsync(id, request, farmerId);
    }

    public async Task<bool> DeleteCropAsync(int id, string farmerId)
    {
        return await _cropRepository.DeleteCropAsync(id, farmerId);
    }

    public async Task<IEnumerable<Crop>> GetFarmerCropsAsync(string farmerId)
    {
        return await _cropRepository.GetFarmerCropsAsync(farmerId);
    }

    public async Task<IEnumerable<Crop>> SearchCropsAsync(string? cropName, decimal? maxPrice, string? location)
    {
        return await _cropRepository.SearchCropsAsync(cropName, maxPrice, location);
    }
}