
using pricelist_manager.Server.Models;
using System.ComponentModel.Design;

namespace pricelist_manager.Server.DTOs
{
    public class ProductDTO
    {
        public required Guid PricelistId { get; set; }
        public required string ProductCode { get; set; }
        public int LatestVersion { get; set; } = 0;
        public ProductInstanceDTO CurrentInstance { get; set; } = null!;
        public int TotalVersions { get; set; }
        public string CompanyId { get; set; } = string.Empty;

        public static ProductDTO FromProduct(Product product, string companyId)
        {
            return new ProductDTO
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                LatestVersion = product.LatestVersion,
                CurrentInstance = ProductInstanceDTO.FromProductInstance(product.Versions.Last()),
                CompanyId = companyId,
                TotalVersions = product.Versions.Count
            };
        }

        public static ICollection<ProductDTO> FromProducts(ICollection<Product> products, string companyId)
        {
            ICollection<ProductDTO> prods = [];

            foreach (var product in products)
            {
                prods.Add(FromProduct(product, companyId));
            }

            return prods;
        }
    }

    public class ProductWithVersionsDTO : ProductDTO
    {
        public ICollection<ProductInstanceDTO> Versions { get; set; } = [];

        public static new ProductWithVersionsDTO FromProduct(Product product, string companyId)
        {
            return new ProductWithVersionsDTO
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                LatestVersion = product.LatestVersion,
                CurrentInstance = ProductInstanceDTO.FromProductInstance(product.Versions.Last()),
                CompanyId = companyId,
                TotalVersions = product.Versions.Count,
                Versions = ProductInstanceDTO.FromProductInstances(product.Versions)
            };
        }
    }

    public class ProductWithPricelistDTO : ProductWithVersionsDTO
    {
        public PricelistNoProdsDTO Pricelist { get; set; } = null!;

        public static ProductWithPricelistDTO FromProduct(ProductWithPricelist product)
        {
            return new ProductWithPricelistDTO
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                LatestVersion = product.LatestVersion,
                CurrentInstance = ProductInstanceDTO.FromProductInstance(product.Versions.Last()),
                CompanyId = product.Pricelist.CompanyId,
                TotalVersions = product.Versions.Count,
                Versions = ProductInstanceDTO.FromProductInstances(product.Versions),
                Pricelist = PricelistNoProdsDTO.FromPricelist(product.Pricelist)
            };
        }

        public static ICollection<ProductWithPricelistDTO> FromProducts(ICollection<ProductWithPricelist> products)
        {
            ICollection<ProductWithPricelistDTO> prods = [];

            foreach (var product in products)
            {
                prods.Add(FromProduct(product));
            }

            return prods;
        }
    }
}
