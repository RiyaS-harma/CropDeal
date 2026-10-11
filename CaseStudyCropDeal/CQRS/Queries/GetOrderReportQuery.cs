using CaseStudyCropDeal.CQRS;
using CaseStudyCropDeal.Data;
using CaseStudyCropDeal.Models;
using Microsoft.EntityFrameworkCore;

namespace CaseStudyCropDeal.CQRS.Queries;

public class GetOrderReportQuery : IQuery<List<Order>>
{
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public string? OrderType { get; set; }
}

public class GetOrderReportQueryHandler : IQueryHandler<GetOrderReportQuery, List<Order>>
{
    private readonly ApplicationDbContext _context;

    public GetOrderReportQueryHandler(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Order>> HandleAsync(GetOrderReportQuery query)
    {
        var orders = _context.Orders
            .Include(o => o.Crop)
            .Include(o => o.Farmer)
            .Include(o => o.Dealer)
            .AsQueryable();

        if (query.FromDate.HasValue)
            orders = orders.Where(o => o.CreatedAt >= query.FromDate.Value);
        
        if (query.ToDate.HasValue)
            orders = orders.Where(o => o.CreatedAt <= query.ToDate.Value);

        return await orders.ToListAsync();
    }
}