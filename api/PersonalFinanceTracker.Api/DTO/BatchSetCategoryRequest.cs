namespace PersonalFinanceTracker.Api.DTOs
{
    public class BatchSetCategoryRequest
    {
        public List<int> Ids { get; set; } = new();
        public int? CategoryId { get; set; } // nullable: to clear category
    }
}
