using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    [PrimaryKey(nameof(ProductId), nameof(Version))]
    public class ProductInstance
    {
        public required string ProductId { get; set; }

        public int Version { get; set; } = 0;

        [Length(0, 100)]
        public string Name { get; set; } = String.Empty;

        [Length(0, 200)]
        public string Description { get; set; } = String.Empty;

        [Precision(10, 2)]
        public Decimal Price { get; set; } = Decimal.Zero;

        public Product? Product { get; set; } = null!;
    }
}
