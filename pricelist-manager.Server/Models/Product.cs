using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    [PrimaryKey(nameof(PricelistId), nameof(ProductCode))]
    public class Product
    {
        public string PricelistId { get; set; } = String.Empty;

        public string ProductCode { get; set; } = String.Empty;

        [ForeignKey(nameof(LatestVersion))]
        public int LatestVersion { get; set; } = 0;

        [ForeignKey(nameof(PricelistId) + ", " + nameof(ProductCode) + ", " + nameof(LatestVersion))]
        public ProductInstance Instance { get; set; } = null!;
    }
}
