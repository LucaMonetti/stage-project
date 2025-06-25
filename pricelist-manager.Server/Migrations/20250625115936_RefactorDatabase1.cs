using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class RefactorDatabase1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_ProductCode",
                table: "ProductInstances");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductInstances",
                table: "ProductInstances");

            migrationBuilder.DropColumn(
                name: "PricelistId",
                table: "ProductInstances");

            migrationBuilder.RenameColumn(
                name: "ProductCode",
                table: "ProductInstances",
                newName: "ProductId");

            migrationBuilder.AlterColumn<string>(
                name: "ProductCode",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CompanyId",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "ProductInstances",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE Products 
                SET Id = CompanyId + '-' + ProductCode
            ");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductInstances",
                table: "ProductInstances",
                columns: new[] { "ProductId", "Version" });

            migrationBuilder.CreateIndex(
                name: "IX_Products_Id_LatestVersion",
                table: "Products",
                columns: new[] { "Id", "LatestVersion" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_PricelistId",
                table: "Products",
                column: "PricelistId");

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

            migrationBuilder.Sql(@"
                UPDATE Products 
                SET LatestVersion = 0 
                WHERE LatestVersion IS NULL OR LatestVersion = ''
            ");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Pricelists_PricelistId",
                table: "Products",
                column: "PricelistId",
                principalTable: "Pricelists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductInstances_Id_LatestVersion",
                table: "Products",
                columns: new[] { "Id", "LatestVersion" },
                principalTable: "ProductInstances",
                principalColumns: new[] { "ProductId", "Version" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_Products_Id",
                table: "ProductInstances");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Pricelists_PricelistId",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductInstances_Id_LatestVersion",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_Id_LatestVersion",
                table: "Products");

            migrationBuilder.DropIndex(
                name: "IX_Products_PricelistId",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductInstances",
                table: "ProductInstances");

            migrationBuilder.DropIndex(
                name: "IX_ProductInstances_Id",
                table: "ProductInstances");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ProductInstances");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "ProductInstances",
                newName: "ProductCode");

            migrationBuilder.AlterColumn<string>(
                name: "ProductCode",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<Guid>(
                name: "PricelistId",
                table: "ProductInstances",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductInstances",
                table: "ProductInstances",
                columns: new[] { "PricelistId", "ProductCode", "Version" });

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInstances_Products_PricelistId_ProductCode",
                table: "ProductInstances",
                columns: new[] { "PricelistId", "ProductCode" },
                principalTable: "Products",
                principalColumns: new[] { "PricelistId", "ProductCode" },
                onDelete: ReferentialAction.Restrict);
        }
    }
}
