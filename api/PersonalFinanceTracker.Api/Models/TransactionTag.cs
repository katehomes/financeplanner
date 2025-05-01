using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceTracker.Api.Models
{
[Table("transaction_tags")]
    public class TransactionTag
    {
        public int TransactionId { get; set; }
        public Transaction Transaction { get; set; } = null!;

        public int TagId { get; set; }
        public Tag Tag { get; set; } = null!;
    }
}