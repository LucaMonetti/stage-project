using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class ChangePricelistPK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Drop foreign key constraints that reference ProductInstances
            migrationBuilder.DropForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products");

            // 2. Drop primary key on Products table
            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            // 3. Drop primary key on ProductInstances table  
            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductInstances",
                table: "ProductInstances");

            migrationBuilder.AlterColumn<Guid>(
                name: "PricelistId",
                table: "Products",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<Guid>(
                name: "PricelistId",
                table: "ProductInstances",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<Guid>(
            name: "PricelistId",
            table: "ProductInstances",
            nullable: false,
            oldClrType: typeof(int));

            migrationBuilder.AddPrimaryKey(
            name: "PK_ProductInstances",
            table: "ProductInstances",
            columns: new[] { "PricelistId", "Id", "Version" });

            // 6. Recreate primary key on Products
            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode"});

            // 7. Recreate the foreign key constraint
            migrationBuilder.AddForeignKey(
                name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode", "LatestVersion" },
                principalTable: "ProductInstances",
                principalColumns: new[] { "PricelistId", "Id", "Version" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
            name: "FK_Products_ProductInstances_PricelistId_ProductCode_LatestVersion",
            table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Products",
                table: "Products");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductInstances",
                table: "ProductInstances");

            migrationBuilder.AlterColumn<string>(
                name: "PricelistId",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "PricelistId",
                table: "ProductInstances",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddPrimaryKey(
            name: "PK_ProductInstances",
            table: "ProductInstances",
            columns: new[] { "PricelistId", "Id", "Version" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Products",
                table: "Products",
                columns: new[] { "PricelistId", "ProductCode"});

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
