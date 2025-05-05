using PersonalFinanceTracker.Api.Models;

public class TransactionImportPreviewResult
{
    public List<TransactionImportRow> rows { get; set; }

    public List<Category> categories { get; set; }

    public List<Category> importedCategories { get; set; }
}
