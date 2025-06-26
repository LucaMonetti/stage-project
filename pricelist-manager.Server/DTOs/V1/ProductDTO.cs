using pricelist_manager.Server.Models;
using System.ComponentModel.Design;

namespace pricelist_manager.Server.DTOs.V1
{
    public class ProductLiteDTO
    {
        public required Guid PricelistId { get; set; }
        public required string Id { get; set; }

        public int LatestVersion { get; set; } = 0;
        public ProductInstanceDTO CurrentInstance { get; set; } = null!;
        public int TotalVersions { get; set; }

        public string CompanyId { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;
    }

    public class ProductDTO : ProductLiteDTO
    {
        public PricelistLiteDTO? Pricelist { get; set; } = null!;
        public CompanyLiteDTO? Company { get; set; } = null!;
        public ICollection<ProductInstanceDTO>? Versions { get; set; } = null!;
    }
}
