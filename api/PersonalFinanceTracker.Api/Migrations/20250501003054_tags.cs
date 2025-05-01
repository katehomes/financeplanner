using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PersonalFinanceTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class tags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Category_CategoryId",
                schema: "finance",
                table: "Transactions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Category",
                schema: "finance",
                table: "Category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Transactions",
                schema: "finance",
                table: "Transactions");

            migrationBuilder.RenameTable(
                name: "Category",
                schema: "finance",
                newName: "category",
                newSchema: "finance");

            migrationBuilder.RenameTable(
                name: "Transactions",
                schema: "finance",
                newName: "transaction",
                newSchema: "finance");

            migrationBuilder.RenameIndex(
                name: "IX_Transactions_CategoryId",
                schema: "finance",
                table: "transaction",
                newName: "IX_transaction_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_category",
                schema: "finance",
                table: "category",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_transaction",
                schema: "finance",
                table: "transaction",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "tag",
                schema: "finance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tag", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TransactionTags",
                schema: "finance",
                columns: table => new
                {
                    TagsId = table.Column<int>(type: "integer", nullable: false),
                    TransactionsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionTags", x => new { x.TagsId, x.TransactionsId });
                    table.ForeignKey(
                        name: "FK_TransactionTags_tag_TagsId",
                        column: x => x.TagsId,
                        principalSchema: "finance",
                        principalTable: "tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransactionTags_transaction_TransactionsId",
                        column: x => x.TransactionsId,
                        principalSchema: "finance",
                        principalTable: "transaction",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TransactionTags_TransactionsId",
                schema: "finance",
                table: "TransactionTags",
                column: "TransactionsId");

            migrationBuilder.AddForeignKey(
                name: "FK_transaction_category_CategoryId",
                schema: "finance",
                table: "transaction",
                column: "CategoryId",
                principalSchema: "finance",
                principalTable: "category",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_transaction_category_CategoryId",
                schema: "finance",
                table: "transaction");

            migrationBuilder.DropTable(
                name: "TransactionTags",
                schema: "finance");

            migrationBuilder.DropTable(
                name: "tag",
                schema: "finance");

            migrationBuilder.DropPrimaryKey(
                name: "PK_category",
                schema: "finance",
                table: "category");

            migrationBuilder.DropPrimaryKey(
                name: "PK_transaction",
                schema: "finance",
                table: "transaction");

            migrationBuilder.RenameTable(
                name: "category",
                schema: "finance",
                newName: "Category",
                newSchema: "finance");

            migrationBuilder.RenameTable(
                name: "transaction",
                schema: "finance",
                newName: "Transactions",
                newSchema: "finance");

            migrationBuilder.RenameIndex(
                name: "IX_transaction_CategoryId",
                schema: "finance",
                table: "Transactions",
                newName: "IX_Transactions_CategoryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Category",
                schema: "finance",
                table: "Category",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Transactions",
                schema: "finance",
                table: "Transactions",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Category_CategoryId",
                schema: "finance",
                table: "Transactions",
                column: "CategoryId",
                principalSchema: "finance",
                principalTable: "Category",
                principalColumn: "Id");
        }
    }
}
