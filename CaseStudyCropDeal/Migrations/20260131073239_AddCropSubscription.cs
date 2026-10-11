using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CaseStudyCropDeal.Migrations
{
    /// <inheritdoc />
    public partial class AddCropSubscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CropSubscriptions_AspNetUsers_DealerId",
                table: "CropSubscriptions");

            migrationBuilder.DropColumn(
                name: "ReceiptNumber",
                table: "Receipts");

            migrationBuilder.DropColumn(
                name: "InvoiceNumber",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "BankAccounts");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "CropName",
                table: "CropSubscriptions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_CropSubscriptions_AspNetUsers_DealerId",
                table: "CropSubscriptions",
                column: "DealerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CropSubscriptions_AspNetUsers_DealerId",
                table: "CropSubscriptions");

            migrationBuilder.DropColumn(
                name: "CropName",
                table: "CropSubscriptions");

            migrationBuilder.AddColumn<string>(
                name: "ReceiptNumber",
                table: "Receipts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "Notifications",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "InvoiceNumber",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "BankAccounts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_CropSubscriptions_AspNetUsers_DealerId",
                table: "CropSubscriptions",
                column: "DealerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
