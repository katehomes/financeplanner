namespace PersonalFinanceTracker.Api.DTOs
{
    public class BatchAlterTagsRequest
    {
        public List<int> Ids { get; set; } = new();
        public List<int> TagIds { get; set; } = new();
    }
}
