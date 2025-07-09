using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixUpdateList2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_UpdateLists_UpdateListId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductsToUpdateLists_Products_ProductId",
                table: "ProductsToUpdateLists");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductsToUpdateLists",
                table: "ProductsToUpdateLists");

            migrationBuilder.DropIndex(
                name: "IX_ProductsToUpdateLists_UpdateListId",
                table: "ProductsToUpdateLists");

            migrationBuilder.DropIndex(
                name: "IX_Products_UpdateListId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "UpdateListId",
                table: "Products");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductsToUpdateLists",
                table: "ProductsToUpdateLists",
                columns: new[] { "UpdateListId", "ProductId" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductsToUpdateLists_ProductId",
                table: "ProductsToUpdateLists",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsToUpdateLists_Products_ProductId",
                table: "ProductsToUpdateLists",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists",
                column: "UpdateListId",
                principalTable: "UpdateLists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductsToUpdateLists_Products_ProductId",
                table: "ProductsToUpdateLists");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductsToUpdateLists",
                table: "ProductsToUpdateLists");

            migrationBuilder.DropIndex(
                name: "IX_ProductsToUpdateLists_ProductId",
                table: "ProductsToUpdateLists");

            migrationBuilder.AddColumn<int>(
                name: "UpdateListId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductsToUpdateLists",
                table: "ProductsToUpdateLists",
                columns: new[] { "ProductId", "UpdateListId" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductsToUpdateLists_UpdateListId",
                table: "ProductsToUpdateLists",
                column: "UpdateListId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_UpdateListId",
                table: "Products",
                column: "UpdateListId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_UpdateLists_UpdateListId",
                table: "Products",
                column: "UpdateListId",
                principalTable: "UpdateLists",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsToUpdateLists_Products_ProductId",
                table: "ProductsToUpdateLists",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists",
                column: "UpdateListId",
                principalTable: "UpdateLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
