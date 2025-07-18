using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace pricelist_manager.Server.DTOs.V1
{
    public class ProductCsvDTO
    {
        public required string ProductCode { get; set; }

        [StringLength(100)]
        public required string Name { get; set; }

        [StringLength(200)]
        public string Description { get; set; } = string.Empty;

        [Precision(10, 2)]
        public decimal Price { get; set; } = decimal.Zero;

        [Precision(10, 2)]
        public decimal Cost { get; set; } = decimal.Zero;

        [Precision(2, 2)]
        public decimal Margin { get; set; } = 1.0M;

        public string AccountingControl { get; set; } = string.Empty;
        public string CDA { get; set; } = string.Empty;
        public string SalesItem { get; set; } = string.Empty;
    }
}