using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    public class Product
    {
        [Key]
        [ForeignKey(nameof(PricelistId))]
        public string PricelistId { get; set; } = String.Empty;

        [Key]
        public string ProductCode { get; set; } = String.Empty;

        [ForeignKey(nameof(LatestVersion))]
        public int LatestVersion { get; set; } = 0;
    }
}
