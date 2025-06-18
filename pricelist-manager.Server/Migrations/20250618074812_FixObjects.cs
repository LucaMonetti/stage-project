using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixObjects : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_PricelistId_ProductCode_LatestVersion",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Products_PricelistId_ProductCode_LatestVersion",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode", "LatestVersion" });

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode", "LatestVersion" },
                principalTable: "ProductInstances",
                principalColumns: new[] { "PricelistId", "Id", "Version" },
                onDelete: ReferentialAction.Restrict);
        }
    }
}
