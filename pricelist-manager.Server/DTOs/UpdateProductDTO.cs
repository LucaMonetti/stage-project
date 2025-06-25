using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs
{
    public class UpdateProductDTO
    {
        public required string ProductId { get; set; } = string.Empty;

        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        public string Description { get; set; } = string.Empty;

        [Precision(10, 2)]
        public decimal Price { get; set; }

        public static UpdateProductDTO FromProductInstance(ProductInstance product)
        {
            return new UpdateProductDTO
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price
            };
        }

        public static ProductInstance TurnIntoInstance(UpdateProductDTO dto, int version)
        {
            return new ProductInstance
            {
                ProductId = dto.ProductId,
                Description = dto.Description,
                Name = dto.Name,
                Price = dto.Price,
                Version = version
            };
        }
    }
}
