using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalFinanceTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class tags_remove_trans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TransactionTags",
                schema: "finance");

            migrationBuilder.AddColumn<int>(
                name: "TransactionId",
                schema: "finance",
                table: "tag",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_tag_TransactionId",
                schema: "finance",
                table: "tag",
                column: "TransactionId");

            migrationBuilder.AddForeignKey(
                name: "FK_tag_transaction_TransactionId",
                schema: "finance",
                table: "tag",
                column: "TransactionId",
                principalSchema: "finance",
                principalTable: "transaction",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tag_transaction_TransactionId",
                schema: "finance",
                table: "tag");

            migrationBuilder.DropIndex(
                name: "IX_tag_TransactionId",
                schema: "finance",
                table: "tag");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                schema: "finance",
                table: "tag");

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
        }
    }
}
