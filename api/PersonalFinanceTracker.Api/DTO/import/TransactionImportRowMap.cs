using CsvHelper.Configuration;
using PersonalFinanceTracker.Api.DTOs;
using System.Globalization;

public class TransactionImportRowMap : ClassMap<TransactionImportRow>
{
    public TransactionImportRowMap()
    {
        Map(m => m.Date)
            .TypeConverterOption
            .DateTimeStyles(DateTimeStyles.AssumeUniversal)
            .TypeConverterOption
            .Format("MM/dd/yyyy");

        Map(m => m.Amount);
        Map(m => m.CategoryName);
        Map(m => m.Description);
    }
}
