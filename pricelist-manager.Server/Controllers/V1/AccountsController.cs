using Asp.Versioning;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1;
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
    [Route("api/v{version:apiVersion}/accounts")]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> UserManager;
        private readonly RoleManager<IdentityRole> RoleManager;
        private readonly IUserRepository UserRepository;
        private readonly IConfiguration Configuration;
        private readonly DataContext Context;

        public AccountsController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, DataContext context, IUserRepository userRepository)
        {
            UserManager = userManager;
            RoleManager = roleManager;
            Configuration = configuration;
            Context = context;
            UserRepository = userRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<UserDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await UserRepository.GetAll();

            return Ok(UserDTO.FromUsers(data));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            // Basic Checks
            if (!Roles.IsValidRole(dto.Role)) {
                ModelState.AddModelError("", "Invalid role!");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // User creation
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                CompanyId = dto.CompanyId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                UserName = dto.Email
            };

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
            return Ok(new {message = "User registered successfully!"});
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(dto.Email);

            if (user == null)
                return NotFound("User Not Found!");

            bool isPasswordCorrect = await UserManager.CheckPasswordAsync(user, dto.Password);

            if (!isPasswordCorrect)
            {
                return Unauthorized();
            }

            var userRoles = await UserManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            var token = new JwtSecurityToken(
                    issuer: Configuration["Jwt:Issuer"],
                    expires: DateTime.Now.AddMinutes(double.Parse(Configuration["Jwt:ExpiryMinutes"]!)),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!)),
                    SecurityAlgorithms.HmacSha256));

            return Ok(new {token = new JwtSecurityTokenHandler().WriteToken(token)});
        }

        [HttpPost("add-role")]
        public async Task<IActionResult> AddRole([FromBody] string role)
        {
            if (!await RoleManager.RoleExistsAsync(role))
            {
                var result = await RoleManager.CreateAsync(new IdentityRole(role));
                if (result.Succeeded)
                {
                    return Ok(new { message = "Role added successfully" });
                }

                return BadRequest(result.Errors);
            }

            return BadRequest("Role already exists");
        }

        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole([FromBody] UserRoleDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await UserManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            var result = await UserManager.AddToRoleAsync(user, dto.Role);
            if (result.Errors.Any())
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Role assigned successfully" });

        }
    }
}
