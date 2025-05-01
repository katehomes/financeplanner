using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalFinanceTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class tag_border_text : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_transaction_tags_tag_TagId",
                schema: "finance",
                table: "transaction_tags");

            migrationBuilder.AddColumn<string>(
                name: "Border",
                schema: "finance",
                table: "tag",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Text",
                schema: "finance",
                table: "tag",
                type: "text",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_transaction_tags_tag_TagId",
                schema: "finance",
                table: "transaction_tags",
                column: "TagId",
                principalSchema: "finance",
                principalTable: "tag",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_transaction_tags_tag_TagId",
                schema: "finance",
                table: "transaction_tags");

            migrationBuilder.DropColumn(
                name: "Border",
                schema: "finance",
                table: "tag");

            migrationBuilder.DropColumn(
                name: "Text",
                schema: "finance",
                table: "tag");

            migrationBuilder.AddForeignKey(
                name: "FK_transaction_tags_tag_TagId",
                schema: "finance",
                table: "transaction_tags",
                column: "TagId",
                principalSchema: "finance",
                principalTable: "tag",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
