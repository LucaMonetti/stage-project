using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    [PrimaryKey(nameof(PricelistId), nameof(Id), nameof(Version))]
    public class ProductInstance
    {
        [ForeignKey(nameof(PricelistId))]
        public string PricelistId { get; set; } = String.Empty;

        public string Id { get; set; } = String.Empty;

        public int Version { get; set; } = 0;

        [Length(0, 100)]
        public string Name { get; set; } = String.Empty;

        [Length(0, 200)]
        public string Description { get; set; } = String.Empty;

        [Column("Type = decimal(10, 2")]
        public Decimal Price { get; set; } = Decimal.Zero;
    }
}
