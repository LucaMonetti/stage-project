using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    public class Pricelist
    {
        [Key]
        [Required]
        public Guid Id { get; set; }

        [Required]
        [Length(5, 50)]
        public string Name { get; set; } = String.Empty;

        [Length(0, 200)]
        public string Description { get; set; } = String.Empty;

        [Required]
        public string CompanyId { get; set; } = string.Empty;

        [ForeignKey(nameof(CompanyId))]
        public Company? Company { get; set; } = null!;

        public virtual ICollection<Product> Products { get; set; } = [];
    }
}
