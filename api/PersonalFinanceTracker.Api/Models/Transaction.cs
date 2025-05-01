using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

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
        
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
    }
}