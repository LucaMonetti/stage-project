using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.DTOs.V1
{
    public class CreateUpdateListDTO
    {
        public required string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ICollection<string>? Products { get; set; } = [];
    }
}
