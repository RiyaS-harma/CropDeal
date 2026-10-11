using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CaseStudyCropDeal.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToCrop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Column already exists in DB from previous partial migration
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Crops");
        }
    }
}
