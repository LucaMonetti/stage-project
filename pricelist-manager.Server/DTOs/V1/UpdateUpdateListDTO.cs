using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdateUpdateListDTO
    {
        public required int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Status? Status { get; set; }
    }

    public class AddProductsUpdateListDTO
    {
        public required int Id { get; set; }
        public required ICollection<string>? ProductIds { get; set; } = [];
    }

    public class RemoveProductUpdateListDTO
    {
        public required string ProductId { get; set; }
    }


    public class RemoveProductsUpdateListDTO
    {
        public required int Id { get; set; }
        public required ICollection<string>? ProductIds { get; set; } = [];
    }

    public class UpdateListStatusDTO
    {
        public required int Id { get; set; }
        public required Status Status { get; set; }
    }
}
