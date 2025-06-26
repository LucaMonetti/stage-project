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

        [Precision(10, 2)]
        public Decimal Cost { get; set; } = Decimal.Zero;

        public string AccountingControl { get; set; } = String.Empty;
        public string CDA { get; set; } = String.Empty;
        public string SalesItem { get; set; } = String.Empty;

        public static UpdateProductDTO FromProductInstance(ProductInstance product)
        {
            return new UpdateProductDTO
            {
                ProductId = product.ProductId,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Cost = product.Cost,
                AccountingControl = product.AccountingControl,
                SalesItem = product.SalesItem,
                CDA = product.CDA,
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
                Version = version,
                CDA = dto.CDA,
                Cost = dto.Cost,
                AccountingControl = dto.AccountingControl,
                SalesItem = dto.SalesItem
            };
        }
    }
}
