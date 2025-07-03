using Microsoft.EntityFrameworkCore;

namespace pricelist_manager.Server.Models
{
    public class ProductToUpdateList
    {
        public required string ProductId { get; set; }
        public required int UpdateListId { get; set; }

        public Status Status { get; set; } = Status.Pending;

        // Navigation
        public virtual Product Product { get; set; } = null!;
        public virtual UpdateList UpdateList { get; set; } = null!;
    }
}
