using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIDtoProductInstance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "ProductInstances",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.Sql(@"
                UPDATE ProductInstances 
                SET UserId = (SELECT TOP 1 Id FROM AspNetUsers)
                WHERE UserId IS NULL
            ");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "ProductInstances",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "PricelistId",
                table: "PricelistLoggers",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_ProductInstances_UserId",
                table: "ProductInstances",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductInstances_AspNetUsers_UserId",
                table: "ProductInstances",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductInstances_AspNetUsers_UserId",
                table: "ProductInstances");

            migrationBuilder.DropIndex(
                name: "IX_ProductInstances_UserId",
                table: "ProductInstances");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ProductInstances");

            migrationBuilder.AlterColumn<string>(
                name: "PricelistId",
                table: "PricelistLoggers",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }
    }
}
