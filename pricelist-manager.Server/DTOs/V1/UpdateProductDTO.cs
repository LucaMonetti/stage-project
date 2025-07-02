using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs.V1
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
        public decimal Cost { get; set; } = decimal.Zero;

        public string AccountingControl { get; set; } = string.Empty;
        public string CDA { get; set; } = string.Empty;
        public string SalesItem { get; set; } = string.Empty;
    }
}
