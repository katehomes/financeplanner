public class TransactionImportRow
{
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? Description { get; set; }
}
