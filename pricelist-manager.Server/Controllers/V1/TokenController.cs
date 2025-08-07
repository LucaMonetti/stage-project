using System.Security.Claims;
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
    [Authorize]
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

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, _) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in to make this action."
                });
            }

            string accessToken = tokenApi.AccessToken;
            string refreshToken = tokenApi.RefreshToken;

            var principal = TokenService.GetPrincipleFromExipiredToken(accessToken);

            var email = principal.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            var user = await UserService.FindByEmailAsync(email ?? "");

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
            }
            catch (Exception ex)
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
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Revoke()
        {
            if (User.Identity == null)
                return NoContent();

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, loggedRoles) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null && !loggedRoles.Contains("Admin"))
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged as an admin to perform this action."
                });
            }

            loggedUser!.RefreshToken = null;

            await UserRepository.UpdateAsync(loggedUser);

            return NoContent();
        }
    }
}
