using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdateListLiteDTO
    {
        public required int Id { get; set; }
        public required string Name { get; set; } = string.Empty;
        public required string CompanyId { get; set; }

        public required string Description { get; set; } = string.Empty;
        public required DateTime CreatedAt { get; set; } = DateTime.Now;
        public required Status Status { get; set; } = Status.Pending;

        public required int TotalProducts { get; set; } = 0;
        public required int EditedProducts { get; set; } = 0;
    }
    public class UpdateListDTO : UpdateListLiteDTO
    {
    }
}
