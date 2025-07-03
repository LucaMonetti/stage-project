namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdateListProductDTO
    {
        public required string Id { get; set; }
        public int LatestVersion { get; set; } = 0;
        public ProductInstanceDTO CurrentInstance { get; set; } = null!;
    }
}
