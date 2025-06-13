namespace pricelist_manager.Server.DTOs
{
    public class LoginDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public string CompanyId { get; set; } = string.Empty;
    }
}
