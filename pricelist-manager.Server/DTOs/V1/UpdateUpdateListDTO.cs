using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdateUpdateListDTO
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
        public required Status Status { get; set; }
    }

    public class AddProductsUpdateListDTO
    {   
        public required int Id { get; set; }
        public required ICollection<string>? ProductIds { get; set; } = [];
    }
}
