using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.Models
{
    public class User : IdentityUser
    {
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [ForeignKey(nameof(Company))]
        public string CompanyId { get; set; } = string.Empty;
        public Company Company { get; set; } = null!;

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExiryTime { get; set; }

        public ICollection<ProductInstance> UpdatedProductInstances { get; set; } = [];
    }
}
