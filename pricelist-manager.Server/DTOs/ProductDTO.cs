
using pricelist_manager.Server.Models;
using System.ComponentModel.Design;

namespace pricelist_manager.Server.DTOs
{
    public class ProductDTO
    {
        public required Guid PricelistId { get; set; }
        public required string Id { get; set; }

        public int LatestVersion { get; set; } = 0;
        public ProductInstanceDTO CurrentInstance { get; set; } = null!;
        public int TotalVersions { get; set; }

        public string CompanyId { get; set; } = string.Empty;
        public string ProductCode { get; set; } = string.Empty;

        public PricelistDTO? Pricelist { get; set; } = null!;
        public CompanyDTO? Company { get; set; } = null!;
        public ICollection<ProductInstanceDTO>? Versions { get; set; } = null!;

        public static ProductDTO FromProduct(Product product, CompanyDTO? company = null!)
        {
            return new ProductDTO
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                LatestVersion = product.LatestVersion,
                CurrentInstance = ProductInstanceDTO.FromProductInstance(product.Versions.Last()),
                CompanyId = product.CompanyId,
                TotalVersions = product.Versions.Count,
                Id = product.Id,
                Pricelist = product.Pricelist != null ? PricelistDTO.FromPricelist(product.Pricelist) : null!,
                Company = company,
                Versions = ProductInstanceDTO.FromProductInstances(product.Versions)
            };
        }

        public static ICollection<ProductDTO> FromProducts(ICollection<Product> products)
        {
            ICollection<ProductDTO> prods = [];

            foreach (var product in products)
            {
                prods.Add(FromProduct(product));
            }

            return prods;
        }
    }
}
