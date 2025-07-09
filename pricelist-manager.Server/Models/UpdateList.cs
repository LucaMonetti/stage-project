using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.Design;

namespace pricelist_manager.Server.Models
{
    public class UpdateList
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Length(1, 100)]
        public required string Name { get; set; } = string.Empty;
        [Length(1, 200)]
        public required string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Status Status { get; set; } = Status.Pending;

        // Navigation
        public virtual ICollection<ProductToUpdateList> ProductsToUpdateLists { get; set; } = [];
    }
}
