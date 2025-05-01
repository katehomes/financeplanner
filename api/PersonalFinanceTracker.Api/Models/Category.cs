using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceTracker.Api.Models
{
    [Table("category")]
    public class Category
    {
        public int Id { get; set; }
        
        public required string Name { get; set; }
        public int Order { get; set; }

        public String? Description { get; set; }
    }
}