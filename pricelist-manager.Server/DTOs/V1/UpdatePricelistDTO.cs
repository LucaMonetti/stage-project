using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdatePricelistDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Length(5, 50)]
        public required string Name { get; set; }

        [Length(0, 200)]
        public string Description { get; set; } = String.Empty;

        public required string CompanyId { get; set; }
    }
}
