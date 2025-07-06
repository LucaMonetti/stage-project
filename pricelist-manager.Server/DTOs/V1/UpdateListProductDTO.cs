using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdateListProductDTO
    {
        public required string Id { get; set; }
        public int LatestVersion { get; set; }

        public Status Status { get; set; }
        public ProductInstanceDTO CurrentInstance { get; set; } = null!;
    }
}
