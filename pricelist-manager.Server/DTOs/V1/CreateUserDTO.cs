using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs.V1
{
    public class CreateUserDTO
    {
        [MaxLength(100)]
        public required string FirstName { get; set; }
        public required string Password { get; set; }
        [MaxLength(100)]
        public required string LastName { get; set; }
        public string? Username { get; set; } = string.Empty;
        public required string Email { get; set; }
        public string? Phone { get; set; } = string.Empty;
        public required string CompanyID { get; set; }
        public required string Role {  get; set; } = Roles.USER;
    }
}