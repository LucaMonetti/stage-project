namespace pricelist_manager.Server.DTOs
{
    public class RegisterDTO
    {
        public required string FirstName { get; set; }
        public required string LastName{ get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
        public string CompanyId { get; set; } = string.Empty;
    }
}
