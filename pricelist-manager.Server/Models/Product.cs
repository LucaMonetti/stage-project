using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    public class Product
    {
        public string Id { get; set; } = "";

        public required string ProductCode { get; set; }
        public required string CompanyId { get; set; }

        public int LatestVersion { get; set; } = 0;

        [NotMapped]
        public ProductInstance? CurrentInstance =>
        Versions?.FirstOrDefault(v => v.Version == LatestVersion);

        [ForeignKey(nameof(Id))]
        public ICollection<ProductInstance> Versions { get; set; } = [];

        public Guid PricelistId { get; set; }

        [ForeignKey(nameof(PricelistId))]
        public virtual Pricelist Pricelist { get; set; } = null!;

        [ForeignKey(nameof(CompanyId))]
        public virtual Company Company { get; set; } = null!;

        public virtual ICollection<ProductToUpdateList> ProductsToUpdateLists { get; set; } = [];

    }
}
