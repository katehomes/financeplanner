using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalFinanceTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTransactionIdFromTag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
    }
}
