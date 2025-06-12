using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    public class ProductInstance
    {
        [Key]
        [ForeignKey(nameof(PricelistId))]
        public string PricelistId { get; set; } = String.Empty;

        [Key]
        public string ProductCode { get; set; } = String.Empty;

        [Key]
        public int Vesion { get; set; } = 0;

        [Length(0, 100)]
        public string Name { get; set; } = String.Empty;

        [Length(0, 200)]
        public string Description { get; set; } = String.Empty;

        [Column("Type = decimal(10, 2")]
        public Decimal Price { get; set; } = Decimal.Zero;
    }
}
