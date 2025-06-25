using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs
{
    public class UpdateProductDTO
    {
        [Required]
        public required string ProductCode { get; set; }

        [Required]
        [ForeignKey(nameof(PricelistId))]
        public required Guid PricelistId { get; set; }

        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        [Precision(10, 2)]
        public decimal? Price { get; set; }

        public static UpdateProductDTO FromProductInstance(ProductInstance product)
        {
            return new UpdateProductDTO
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
            };
        }

        public static ProductInstance CreateInstanceFromDTO(UpdateProductDTO dto, int version)
        {
            return new ProductInstance
            {
                PricelistId = dto.PricelistId,
                ProductCode = dto.ProductCode,
                Description = dto.Description ?? "",
                Name = dto.Name ?? "",
                Price = dto.Price ?? Decimal.Zero,
                Version = version
            };
        }
    }
}
