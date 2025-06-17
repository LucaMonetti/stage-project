
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.DTOs
{
    public class ProductDTO
    {
        public required Guid PricelistId { get; set; }
        public required string ProductCode { get; set; }
        public int LatestVersion { get; set; } = 0;
        public ProductInstanceDTO CurrentInstance { get; set; } = null!;
        //public int TotalVersions { get; set; }
        // public DateTime LastModified { get; set; }
        //public string CompanyId { get; set; } = string.Empty;

        //public static ProductDTO FromProduct(Product product)
        //{
        //    return new ProductDTO
        //    {
        //        PricelistId = product.PricelistId,
        //        ProductCode = product.ProductCode,
        //        LatestVersion = product.LatestVersion,
        //        CurrentInstance = ProductInstanceDTO.FromProductInstance(product.Instance)
        //    };
        //}
    }
}
