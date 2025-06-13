using pricelist_manager.Server.Helpers;

namespace pricelist_manager.Server.DTOs
{
    public class RegisterDTO
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string CompanyId { get; set; } = string.Empty;
        public string Role { get; set; } = Roles.USER;
    }
}
