using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs
{
    public class CreateProductDTO
    {
        [Required]
        public required string ProductCode { get; set; }

        [Required]
        [ForeignKey(nameof(PricelistId))]
        public Guid PricelistId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }

        public static Product ToProduct(CreateProductDTO product)
        {
            return new Product
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                LatestVersion = 0,
                Versions = [ToProductInstance(product)]
            };
        }

        public static ProductInstance ToProductInstance(CreateProductDTO product)
        {
            return new ProductInstance
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Version = 0
            };
        }
    }
}
