namespace CaseStudyCropDeal.Events;

public abstract class DomainEvent
{
    public Guid Id { get; } = Guid.NewGuid();
    public DateTime OccurredOn { get; } = DateTime.UtcNow;
}

public class PaymentInitiatedEvent : DomainEvent
{
    public int OrderId { get; set; }
    public string DealerId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
}

public class PaymentCompletedEvent : DomainEvent
{
    public int OrderId { get; set; }
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}

public class PaymentFailedEvent : DomainEvent
{
    public int OrderId { get; set; }
    public string Reason { get; set; } = string.Empty;
}