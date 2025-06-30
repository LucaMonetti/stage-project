using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UserLiteDTO
    {
        public required string Id { get; set; }
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        public string? Username { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Phone { get; set; } = string.Empty;
        public ICollection<string> Roles { get; set; } = [];
    }
    public class UserDTO : UserLiteDTO
    {
        public CompanyLiteDTO Company { get; set; } = null!;
    }
}