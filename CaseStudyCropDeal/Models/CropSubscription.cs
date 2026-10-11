using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaseStudyCropDeal.Models
{
    public class CropSubscription
    {
        public int Id { get; set; }
        public string DealerId { get; set; } = string.Empty;
        public string CropType { get; set; } = string.Empty;
        public string CropName { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public User Dealer { get; set; } = null!;
    }
}