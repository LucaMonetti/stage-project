using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixUpdateList1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UpdateLists_UpdateLists_UpdateListId",
                table: "UpdateLists");

            migrationBuilder.DropIndex(
                name: "IX_UpdateLists_UpdateListId",
                table: "UpdateLists");

            migrationBuilder.DropColumn(
                name: "UpdateListId",
                table: "UpdateLists");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UpdateListId",
                table: "UpdateLists",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UpdateLists_UpdateListId",
                table: "UpdateLists",
                column: "UpdateListId");

            migrationBuilder.AddForeignKey(
                name: "FK_UpdateLists_UpdateLists_UpdateListId",
                table: "UpdateLists",
                column: "UpdateListId",
                principalTable: "UpdateLists",
                principalColumn: "Id");
        }
    }
}
