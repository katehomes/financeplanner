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

        public string? Color { get; set; } // optional hex or tailwind class name
        
        [JsonIgnore]
        public ICollection<TransactionTag> TransactionTags { get; set; } = new List<TransactionTag>();

    }
}
