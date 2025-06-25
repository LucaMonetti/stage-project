using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs
{
    public class CreateProductDTO
    {
        public required string ProductCode { get; set; }
        public required string CompanyId { get; set; }

        public Guid PricelistId { get; set; }

        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string Description { get; set; } = string.Empty;

        [Precision(10, 2)]
        public decimal Price { get; set; }

        public static Product ToProduct(CreateProductDTO product)
        {
            return new Product
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                CompanyId = product.CompanyId,
                LatestVersion = 0,
                Versions = [ToProductInstance(product)]
            };
        }

        public static ProductInstance ToProductInstance(CreateProductDTO product)
        {
            return new ProductInstance
            {
                ProductId = $"{product.CompanyId}-{product.ProductCode}",
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Version = 0
            };
        }
    }
}
