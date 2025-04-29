using Microsoft.EntityFrameworkCore;

namespace PersonalFinanceTracker.Api.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
    }
}