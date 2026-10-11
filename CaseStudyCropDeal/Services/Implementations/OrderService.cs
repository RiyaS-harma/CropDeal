using CaseStudyCropDeal.Models;
using CaseStudyCropDeal.Models.DTOs;
using CaseStudyCropDeal.Repositories.Interfaces;
using CaseStudyCropDeal.Services.Interfaces;

namespace CaseStudyCropDeal.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<Order> CreateOrderAsync(CreateOrderRequest request, string dealerId)
    {
        return await _orderRepository.CreateOrderAsync(request, dealerId);
    }

    public async Task<Order?> GetOrderByIdAsync(int id, string userId)
    {
        return await _orderRepository.GetOrderByIdAsync(id, userId);
    }

    public async Task<IEnumerable<Order>> GetUserOrdersAsync(string userId)
    {
        return await _orderRepository.GetUserOrdersAsync(userId);
    }

    public async Task<bool> ConfirmOrderAsync(int id, string farmerId)
    {
        return await _orderRepository.ConfirmOrderAsync(id, farmerId);
    }

    public async Task<bool> CompleteOrderAsync(int id, string dealerId)
    {
        return await _orderRepository.CompleteOrderAsync(id, dealerId);
    }
}