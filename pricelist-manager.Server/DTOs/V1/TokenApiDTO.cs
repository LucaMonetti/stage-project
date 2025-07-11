namespace pricelist_manager.Server.DTOs.V1
{
    public interface TokenApiDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
