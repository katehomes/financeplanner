using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace PersonalFinanceTracker.Api.Models
{
[Table("tag")]
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public string? Color { get; set; }

        public string? Border { get; set; }

        public string? Text { get; set; }
        
        [JsonIgnore]
        public ICollection<TransactionTag> TransactionTags { get; set; } = new List<TransactionTag>();

        [NotMapped]
        public List<Transaction> Transactions { get; set; } = new();
    }
}
