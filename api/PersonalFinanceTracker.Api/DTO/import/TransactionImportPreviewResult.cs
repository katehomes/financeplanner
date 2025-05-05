using PersonalFinanceTracker.Api.Models;

public class TransactionImportPreviewResult
{
    public List<Transaction> rows { get; set; }

    public List<Category> categories { get; set; }

    public List<Category> importedCategories { get; set; }
}
