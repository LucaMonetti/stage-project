using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace pricelist_manager.Server.DTOs.V1
{
    public class CreateCompanyDTO
    {
        [Length(1, 10)]
        public required string Id { get; set; }

        [Length(2, 100)]
        public required string Name { get; set; }

        [Length(2, 100)]
        public required string Address { get; set; }

        [StringLength(5, MinimumLength = 5, ErrorMessage = "Must have 5 digits.")]
        public required string PostalCode { get; set; }

        [Length(2, 10)]
        public required string Province { get; set; }

        [Length(2, 30)]
        public required string Phone { get; set; }

        public required IFormFile Logo { get; set; }

        public string LogoUri { get; set; } = string.Empty;

        [Length(7, 7)]
        public required string InterfaceColor { get; set; } = string.Empty;
    }
}
