using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Api.Models;

namespace PersonalFinanceTracker.Api.Data
{

    public class FinanceContext : DbContext 
    {
        public FinanceContext(DbContextOptions<FinanceContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("finance");

            modelBuilder.Model.SetAnnotation("Relational:HistoryTableSchema", "public");
            modelBuilder.Model.SetAnnotation("Relational:HistoryTableName", "__EFMigrationsHistory");

            modelBuilder.Entity<Transaction>()
                .HasMany(t => t.Tags);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Tag> Tags { get; set; } = default!;
            }
}