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

            // modelBuilder.Entity<Transaction>()
            //     .HasMany(t => t.Tags);

            modelBuilder.Entity<TransactionTag>()
                .HasKey(tt => new { tt.TransactionId, tt.TagId });

            modelBuilder.Entity<TransactionTag>()
                .HasOne(tt => tt.Transaction)
                .WithMany(t => t.TransactionTags)
                .HasForeignKey(tt => tt.TransactionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TransactionTag>()
                .HasOne(tt => tt.Tag)
                .WithMany(t => t.TransactionTags)
                .HasForeignKey(tt => tt.TagId)
                .OnDelete(DeleteBehavior.Restrict);


            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Tag> Tags { get; set; }

public DbSet<TransactionTag> TransactionTags { get; set; }
    }
}