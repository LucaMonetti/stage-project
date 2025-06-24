using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    [PrimaryKey(nameof(PricelistId), nameof(ProductCode))]
    public class Product
    {
        [Required]
        public Guid PricelistId { get; set; }

        public string ProductCode { get; set; } = String.Empty;

        [ForeignKey(nameof(LatestVersion))]
        public int LatestVersion { get; set; } = 0;

        public ICollection<ProductInstance> Versions { get; set; } = [];
    }

    public class ProductWithPricelist : Product
    {
        public Pricelist Pricelist { get; set; } = null!;

        public ProductWithPricelist(Product product, Pricelist pricelist)
        {
            PricelistId = product.PricelistId;
            ProductCode = product.ProductCode;
            Pricelist = pricelist;
            LatestVersion = product.LatestVersion;
            Versions = product.Versions;
        }
    }
}
