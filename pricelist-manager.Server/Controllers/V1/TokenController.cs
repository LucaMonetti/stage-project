using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    public class TokenController : ControllerBase
    {
        private readonly ITokenService TokenService;
        private readonly UserManager<User> UserService;
        private readonly IUserRepository UserRepository;

        public TokenController(ITokenService tokenService, UserManager<User> userManager, IUserRepository userRepository)
        {
            this.TokenService = tokenService;
            this.UserService = userManager;
            this.UserRepository = userRepository;
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(TokenApiDTO tokenApi)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            string accessToken = tokenApi.AccessToken;
            string refreshToken = tokenApi.RefreshToken;

            var principal = TokenService.GetPrincipleFromExipiredToken(accessToken);
            var username = principal.Identity.Name;

            var user = await UserService.FindByNameAsync(username);

            if (user is null || user.RefreshToken != refreshToken || user.RefreshTokenExiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid client request");
            }

            var newAccessToken = TokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = TokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;

            try
            {
                await UserRepository.UpdateAsync(user);
            } catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return Ok(new AuthenticateResponse()
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
            });
        }

        [HttpPost("revoke")]
        [Authorize]
        public async Task<IActionResult> Revoke()
        {
            var username = User.Identity.Name;
            var user = await UserService.FindByNameAsync(username);

            if (user is null) return BadRequest();

            user.RefreshToken = null;

            await UserRepository.UpdateAsync(user);

            return NoContent();
        }
    }
}
