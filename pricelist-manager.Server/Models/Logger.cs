using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    public enum DatabaseOperationType
    {
        Create,
        Update,
        Delete,
        UpdateInnerProducts,
        ModifyRoles
    }

    public class Logger
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.Now;

        public required string ActorId { get; set; }
        public required DatabaseOperationType Operation { get; set; }

    }

    public class CompanyLogger : Logger
    {
        public required string CompanyId { get; set; }
    }

    public class PricelistLogger : Logger
    {
        public required Guid PricelistId { get; set; }
    }

    public class UserLogger : Logger
    {
        public required string UserId { get; set; }
    }

    public class UpdateListLogger : Logger
    {
        public required int UpdateListId { get; set; }
    }
}
