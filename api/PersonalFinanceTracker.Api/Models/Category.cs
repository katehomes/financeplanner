using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceTracker.Api.Models
{
    [Table("Category")]
    public class Category
    {
        public int Id { get; set; }
        public decimal Name { get; set; }
        public DateTimeOffset Order { get; set; }

        public String? Description { get; set; }
    }
}