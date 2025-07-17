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

        public AuthController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, DataContext context, IUserRepository userRepository, IUserMappingService userMapping, IMetadataMappingService metadataMapping, ITokenService tokenService)
        {
            UserManager = userManager;
            RoleManager = roleManager;
            Configuration = configuration;
            Context = context;
            UserRepository = userRepository;
            UserMapping = userMapping;
            MetadataMapping = metadataMapping;
            TokenService = tokenService;
        }

        [HttpPost("register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Register([FromBody] CreateUserDTO dto)
        {
            // Basic Checks
            if (!Roles.IsValidRole(dto.Role))
            {
                ModelState.AddModelError("", "Invalid role!");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = UserMapping.MapToUser(dto);

            using var transition = await Context.Database.BeginTransactionAsync();

            var res = await UserManager.CreateAsync(user, dto.Password);

            if (res.Errors.Any())
            {
                await transition.RollbackAsync();
                return BadRequest(res.Errors);
            }

            // Add Roles
            res = await UserManager.AddToRoleAsync(user, dto.Role);

            if (res.Errors.Any())
            {
                await transition.RollbackAsync();
                return BadRequest(res.Errors);
            }

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
