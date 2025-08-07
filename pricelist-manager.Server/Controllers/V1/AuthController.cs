using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> UserManager;
        private readonly RoleManager<IdentityRole> RoleManager;
        private readonly IUserRepository UserRepository;
        private readonly IConfiguration Configuration;
        private readonly DataContext Context;

        private readonly ITokenService TokenService;

        private readonly IUserMappingService UserMapping;
        private readonly IMetadataMappingService MetadataMapping;

        private readonly ILoggerRepository<User> Logger;

        public AuthController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, DataContext context, IUserRepository userRepository, IUserMappingService userMapping, IMetadataMappingService metadataMapping, ITokenService tokenService, ILoggerRepository<User> logger)
        {
            UserManager = userManager;
            RoleManager = roleManager;
            Configuration = configuration;
            Context = context;
            UserRepository = userRepository;
            UserMapping = userMapping;
            MetadataMapping = metadataMapping;
            TokenService = tokenService;
            Logger = logger;
        }

        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register([FromBody] CreateUserDTO dto)
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

            var (_, loggedRoles) = await UserRepository.GetById(currentUserId);

            if (!loggedRoles.Contains("Admin"))
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You can only create users if you are an Admin."
                });
            }


            var user = UserMapping.MapToUser(dto);

            using var transition = await Context.Database.BeginTransactionAsync();

            var resCreateUser = await UserManager.CreateAsync(user, dto.Password);

            if (resCreateUser.Errors.Any())
            {
                await transition.RollbackAsync();
                return BadRequest(resCreateUser.Errors);
            }

            if (!await RoleManager.RoleExistsAsync(Roles.USER))
            {
                var role = new IdentityRole(Roles.USER);
                var resCreateRole = await RoleManager.CreateAsync(role);

                if (resCreateRole.Errors.Any())
                {
                    await transition.RollbackAsync();
                    return BadRequest(resCreateRole.Errors);
                }
            }

            // Add Roles
            var resAddToRole = await UserManager.AddToRoleAsync(user, Roles.USER);

            if (resAddToRole.Errors.Any())
            {
                await transition.RollbackAsync();
                return BadRequest(resAddToRole.Errors);
            }

            await Logger.LogAsync(user, currentUserId, DatabaseOperationType.Create);

            // Success Response
            await transition.CommitAsync();
            return Ok(new { message = "User registered successfully!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var (user, roles) = await UserRepository.GetByEmail(dto.Email);

            if (user == null)
                return NotFound("User Not Found!");

            bool isPasswordCorrect = await UserManager.CheckPasswordAsync(user, dto.Password);

            if (!isPasswordCorrect)
            {
                return Unauthorized();
            }

            var authClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            authClaims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var accessToken = TokenService.GenerateAccessToken(authClaims);
            var refreshToken = TokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExiryTime = DateTime.Now.AddDays(7);

            try
            {
                await UserRepository.UpdateAsync(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return Ok(new AuthenticateResponse { Token = accessToken, RefreshToken = refreshToken });
        }

    }
}
