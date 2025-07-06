using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixDataContext1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the existing foreign key (assumes default EF name, adjust if different)
            migrationBuilder.DropForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists");

            // Recreate it with ON DELETE CASCADE
            migrationBuilder.AddForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists",
                column: "UpdateListId",
                principalTable: "UpdateLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the cascade FK
            migrationBuilder.DropForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists");

            // Recreate it without cascade (default behavior)
            migrationBuilder.AddForeignKey(
                name: "FK_ProductsToUpdateLists_UpdateLists_UpdateListId",
                table: "ProductsToUpdateLists",
                column: "UpdateListId",
                principalTable: "UpdateLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
