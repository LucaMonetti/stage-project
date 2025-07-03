using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUpdateList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UpdateListId",
                table: "Products",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "UpdateLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    UpdateListId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpdateLists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UpdateLists_UpdateLists_UpdateListId",
                        column: x => x.UpdateListId,
                        principalTable: "UpdateLists",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ProductsToUpdateLists",
                columns: table => new
                {
                    ProductId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UpdateListId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductsToUpdateLists", x => new { x.ProductId, x.UpdateListId });
                    table.ForeignKey(
                        name: "FK_ProductsToUpdateLists_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                        column: x => x.UpdateListId,
                        principalTable: "UpdateLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_UpdateListId",
                table: "Products",
                column: "UpdateListId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductsToUpdateLists_UpdateListId",
                table: "ProductsToUpdateLists",
                column: "UpdateListId");

            migrationBuilder.CreateIndex(
                name: "IX_UpdateLists_UpdateListId",
                table: "UpdateLists",
                column: "UpdateListId");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_UpdateLists_UpdateListId",
                table: "Products",
                column: "UpdateListId",
                principalTable: "UpdateLists",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_UpdateLists_UpdateListId",
                table: "Products");

            migrationBuilder.DropTable(
                name: "ProductsToUpdateLists");

            migrationBuilder.DropTable(
                name: "UpdateLists");

            migrationBuilder.DropIndex(
                name: "IX_Products_UpdateListId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "UpdateListId",
                table: "Products");
        }
    }
}
