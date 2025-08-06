using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdateListCsvDTO
    {
        public required string ProductId { get; set; }

        [StringLength(100)]
        public string? Name { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        [Precision(10, 2)]
        public decimal? Price { get; set; }

        [Precision(10, 2)]
        public decimal? Cost { get; set; }

        [Precision(2, 2)]
        public decimal? Margin { get; set; }

        public string? AccountingControl { get; set; }
        public string? CDA { get; set; }
        public string? SalesItem { get; set; }
    }
}