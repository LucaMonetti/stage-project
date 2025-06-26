using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace pricelist_manager.Server.DTOs.V1
{
    public class CompanyLiteDTO {
        [Length(1, 10)]
        public required string Id { get; set; }

        [Length(2, 100)]
        public string Name { get; set; } = string.Empty;

        [Length(2, 100)]
        public string Address { get; set; } = string.Empty;

        [StringLength(5, MinimumLength = 5, ErrorMessage = "Must have 5 digits.")]
        public string PostalCode { get; set; } = string.Empty;

        [Length(2, 10)]
        public string Province { get; set; } = string.Empty;

        [Length(2, 30)]
        public string Phone { get; set; } = string.Empty;

        [Length(2, 200)]
        public string LogoUri { get; set; } = string.Empty;

        [Length(7, 7)]
        public string InterfaceColor { get; set; } = string.Empty;
    }

    public class CompanyDTO : CompanyLiteDTO
    {
        public ICollection<ProductLiteDTO>? Products { get; set; } = null!;
        public ICollection<PricelistLiteDTO>? Pricelists { get; set; } = null!;
    }

}
