using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace pricelist_manager.Server.DTOs.V1
{
    public class PricelistLiteDTO
    {
        public Guid Id { get; set; }

        [Length(5, 50)]
        public string Name { get; set; } = string.Empty;

        [Length(0, 200)]
        public string Description { get; set; } = string.Empty;
    }

    public class PricelistDTO : PricelistLiteDTO
    {
        public CompanyLiteDTO Company { get; set; } = null!;

        public ICollection<ProductLiteDTO> Products { get; set; } = [];
    }
}