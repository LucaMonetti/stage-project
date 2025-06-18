using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class DeleteBehaviourProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_Id",
                table: "ProductInstances",
                columns: new[] { "PricelistId", "Id" },
                principalTable: "Products",
                principalColumns: new[] { "PricelistId", "ProductCode" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode", "LatestVersion" },
                principalTable: "ProductInstances",
                principalColumns: new[] { "PricelistId", "Id", "Version" },
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_Id",
                table: "ProductInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode", "LatestVersion" },
                principalTable: "ProductInstances",
                principalColumns: new[] { "PricelistId", "Id", "Version" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
