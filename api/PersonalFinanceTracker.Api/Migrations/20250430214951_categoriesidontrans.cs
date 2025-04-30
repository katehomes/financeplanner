using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PersonalFinanceTracker.Api.Migrations
{
    /// <inheritdoc />
    public partial class categoriesidontrans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                schema: "finance",
                table: "Transactions",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Order",
                schema: "finance",
                table: "Category",
                type: "integer",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                schema: "finance",
                table: "Category",
                type: "text",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_CategoryId",
                schema: "finance",
                table: "Transactions",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Category_CategoryId",
                schema: "finance",
                table: "Transactions",
                column: "CategoryId",
                principalSchema: "finance",
                principalTable: "Category",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Category_CategoryId",
                schema: "finance",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_CategoryId",
                schema: "finance",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                schema: "finance",
                table: "Transactions");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "Order",
                schema: "finance",
                table: "Category",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<decimal>(
                name: "Name",
                schema: "finance",
                table: "Category",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
