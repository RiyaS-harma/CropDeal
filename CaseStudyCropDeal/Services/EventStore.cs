namespace CaseStudyCropDeal.Services;

public interface IEventStore
{
    Task SaveEventAsync(object eventData);
}

public class InMemoryEventStore : IEventStore
{
    public async Task SaveEventAsync(object eventData)
    {
        Console.WriteLine($"Event saved: {eventData}");
        await Task.CompletedTask;
    }
}