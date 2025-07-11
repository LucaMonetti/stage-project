namespace pricelist_manager.Server.DTOs.V1
{
    public class AuthenticateResponse
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
    }
}
