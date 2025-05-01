using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceTracker.Api.Models
{
[Table("tag")]
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}
