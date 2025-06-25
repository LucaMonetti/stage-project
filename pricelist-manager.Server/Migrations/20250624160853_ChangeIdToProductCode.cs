using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIdToProductCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_Id",
                table: "ProductInstances");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "ProductInstances",
                newName: "ProductCode");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_ProductCode",
                table: "ProductInstances",
                columns: new[] { "PricelistId", "ProductCode" },
                principalTable: "Products",
                principalColumns: new[] { "PricelistId", "ProductCode" },
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_ProductCode",
                table: "ProductInstances");

            migrationBuilder.RenameColumn(
                name: "ProductCode",
                table: "ProductInstances",
                newName: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_Id",
                table: "ProductInstances",
                columns: new[] { "PricelistId", "Id" },
                principalTable: "Products",
                principalColumns: new[] { "PricelistId", "ProductCode" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
