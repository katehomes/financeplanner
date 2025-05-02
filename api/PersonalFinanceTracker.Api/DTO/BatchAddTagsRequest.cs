namespace PersonalFinanceTracker.Api.DTOs
{
    public class BatchAddTagsRequest
    {
        public List<int> Ids { get; set; } = new();
        public List<int> TagIds { get; set; } = new();
    }
}
