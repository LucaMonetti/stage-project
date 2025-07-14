using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pricelist_manager.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyToUL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompanyId",
                table: "UpdateLists",
                type: "nvarchar(450)",
                nullable: true);

            // Set default CompanyId to "PLA" for existing records
            migrationBuilder.Sql(@"
                UPDATE UpdateLists 
                SET CompanyId = 'PLA'
                WHERE CompanyId IS NULL
            ");

            // Now make the column non-nullable
            migrationBuilder.AlterColumn<string>(
                name: "CompanyId",
                table: "UpdateLists",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UpdateLists_CompanyId",
                table: "UpdateLists",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_UpdateLists_Companies_CompanyId",
                table: "UpdateLists",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UpdateLists_Companies_CompanyId",
                table: "UpdateLists");

            migrationBuilder.DropIndex(
                name: "IX_UpdateLists_CompanyId",
                table: "UpdateLists");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "UpdateLists");
        }
    }
}
