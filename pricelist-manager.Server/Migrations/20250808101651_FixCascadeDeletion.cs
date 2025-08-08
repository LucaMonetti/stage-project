using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeDeletion : Migration
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
                principalColumn: "Id");
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
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
