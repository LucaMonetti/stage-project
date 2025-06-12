using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    public class Company
    {
        [Key]
        [Required]
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
}
