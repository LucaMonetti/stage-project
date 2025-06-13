using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace pricelist_manager.Server.Models
{
    public class User : IdentityUser
    {
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;
        public string CompanyId { get; set; } = string.Empty;

    }
}
