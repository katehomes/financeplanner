using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace PersonalFinanceTracker.Api.Models
{
    [Table("transaction")]
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTimeOffset Date { get; set; }

        public String? Description { get; set; }

        public int? CategoryId { get; set; }
        public Category? Category { get; set; }

        [JsonIgnore]
        public ICollection<TransactionTag> TransactionTags { get; set; } = new List<TransactionTag>();
        
        [NotMapped]
        public List<Tag> Tags { get; set; } = new();
    }
}