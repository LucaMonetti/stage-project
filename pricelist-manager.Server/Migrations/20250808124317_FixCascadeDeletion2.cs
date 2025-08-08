using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeDeletion2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Pricelists_PricelistId",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Pricelists_PricelistId",
                table: "Products",
                column: "PricelistId",
                principalTable: "Pricelists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Pricelists_PricelistId",
                table: "Products");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Pricelists_PricelistId",
                table: "Products",
                column: "PricelistId",
                principalTable: "Pricelists",
                principalColumn: "Id");
        }
    }
}
