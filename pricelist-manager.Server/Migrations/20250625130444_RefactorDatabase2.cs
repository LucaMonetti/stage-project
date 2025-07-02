using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class RefactorDatabase2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_Products_Id",
                table: "ProductInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductInstances_Id_LatestVersion",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_Id_LatestVersion",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_ProductInstances_Id",
                table: "ProductInstances");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "ProductInstances",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInstances_Products_ProductId",
                table: "ProductInstances",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_Products_ProductId",
                table: "ProductInstances");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "ProductInstances",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_Id_LatestVersion",
                table: "Products",
                columns: new[] { "Id", "LatestVersion" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstances_Id",
                table: "ProductInstances",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInstances_Products_Id",
                table: "ProductInstances",
                column: "Id",
                principalTable: "Products",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductInstances_Id_LatestVersion",
                table: "Products",
                columns: new[] { "Id", "LatestVersion" },
                principalTable: "ProductInstances",
                principalColumns: new[] { "ProductId", "Version" },
                onDelete: ReferentialAction.Cascade);
        }
    }
}
