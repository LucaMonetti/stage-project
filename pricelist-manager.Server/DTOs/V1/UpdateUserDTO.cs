using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UpdateUserDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        [MaxLength(100)]
        public required string FirstName { get; set; }
        [MaxLength(100)]
        public required string LastName { get; set; }
        public string? Username { get; set; } = string.Empty;
        public required string Email { get; set; }
        public string? Phone { get; set; } = string.Empty;
        public required string CompanyID { get; set; }
    }
}