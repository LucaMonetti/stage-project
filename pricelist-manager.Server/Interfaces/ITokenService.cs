using System.Security.Claims;

namespace pricelist_manager.Server.Interfaces
{
    public interface ITokenService
    {
        public string GenerateAccessToken(IEnumerable<Claim> claims);
        public string GenerateRefreshToken();
        public ClaimsPrincipal GetPrincipleFromExipiredToken(string token);
    }
}
