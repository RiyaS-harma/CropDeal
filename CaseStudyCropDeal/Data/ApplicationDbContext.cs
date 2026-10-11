using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CaseStudyCropDeal.Models;

namespace CaseStudyCropDeal.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Crop> Crops { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<CropSubscription> CropSubscriptions { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<RatingReview> RatingReviews { get; set; }
    public DbSet<BankAccount> BankAccounts { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<Receipt> Receipts { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public new DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure decimal precision
        builder.Entity<Crop>()
            .Property(c => c.PricePerUnit)
            .HasPrecision(18, 2);
        
        builder.Entity<Crop>()
            .Property(c => c.Quantity)
            .HasPrecision(18, 2);

        builder.Entity<Order>()
            .Property(o => o.PricePerUnit)
            .HasPrecision(18, 2);
        
        builder.Entity<Order>()
            .Property(o => o.Quantity)
            .HasPrecision(18, 2);
        
        builder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        builder.Entity<CartItem>()
            .Property(c => c.Quantity)
            .HasPrecision(18, 2);

        builder.Entity<Transaction>()
            .Property(t => t.Amount)
            .HasPrecision(18, 2);

        builder.Entity<Invoice>()
            .Property(i => i.TotalAmount)
            .HasPrecision(18, 2);

        builder.Entity<Receipt>()
            .Property(r => r.TotalAmount)
            .HasPrecision(18, 2);

        // Configure relationships with NO ACTION to prevent cascade conflicts
        builder.Entity<Order>()
            .HasOne(o => o.Farmer)
            .WithMany()
            .HasForeignKey(o => o.FarmerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Order>()
            .HasOne(o => o.Dealer)
            .WithMany()
            .HasForeignKey(o => o.DealerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Crop>()
            .HasOne(c => c.Farmer)
            .WithMany()
            .HasForeignKey(c => c.FarmerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<CartItem>()
            .HasOne(c => c.Crop)
            .WithMany()
            .HasForeignKey(c => c.CropId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<CartItem>()
            .HasOne(c => c.Dealer)
            .WithMany()
            .HasForeignKey(c => c.DealerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<RatingReview>()
            .HasOne(r => r.Reviewer)
            .WithMany()
            .HasForeignKey(r => r.ReviewerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<RatingReview>()
            .HasOne(r => r.Reviewee)
            .WithMany()
            .HasForeignKey(r => r.RevieweeId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<RatingReview>()
            .HasOne(r => r.Order)
            .WithMany()
            .HasForeignKey(r => r.OrderId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Transaction>()
            .HasOne(t => t.Order)
            .WithMany()
            .HasForeignKey(t => t.OrderId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Invoice>()
            .HasOne(i => i.Order)
            .WithMany()
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Invoice>()
            .HasOne(i => i.Dealer)
            .WithMany()
            .HasForeignKey(i => i.DealerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Receipt>()
            .HasOne(r => r.Order)
            .WithMany()
            .HasForeignKey(r => r.OrderId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<Receipt>()
            .HasOne(r => r.Farmer)
            .WithMany()
            .HasForeignKey(r => r.FarmerId)
            .OnDelete(DeleteBehavior.NoAction);

                builder.Entity<CropSubscription>()
            .HasOne(cs => cs.Dealer)
            .WithMany()
            .HasForeignKey(cs => cs.DealerId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.Entity<ChatMessage>()
            .HasOne(cm => cm.User)
            .WithMany()
            .HasForeignKey(cm => cm.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}