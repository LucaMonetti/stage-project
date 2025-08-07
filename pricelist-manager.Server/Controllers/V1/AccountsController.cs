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
    [Route("api/v{version:apiVersion}/accounts")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> UserManager;
        private readonly RoleManager<IdentityRole> RoleManager;
        private readonly IUserRepository UserRepository;
        private readonly IConfiguration Configuration;
        private readonly DataContext Context;

        private readonly IUserMappingService UserMapping;
        private readonly IMetadataMappingService MetadataMapping;

        private readonly ILoggerRepository<User> Logger;

        public AccountsController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, DataContext context, IUserRepository userRepository, IUserMappingService userMapping, IMetadataMappingService metadataMapping, ILoggerRepository<User> logger)
        {
            UserManager = userManager;
            RoleManager = roleManager;
            Configuration = configuration;
            Context = context;
            Logger = logger;
            UserRepository = userRepository;
            UserMapping = userMapping;
            MetadataMapping = metadataMapping;
        }

        [HttpGet("{userId}")]
        [Authorize]
        public async Task<ActionResult<UserDTO>> GetById(string userId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var (user, _) = await UserRepository.GetById(currentUserId ?? "");

                if (string.IsNullOrEmpty(currentUserId) || user == null)
                {
                    return Unauthorized("Invalid token");
                }

                var data = await UserRepository.GetById(userId);
                return Ok(UserMapping.MapToDTO(data.user, data.roles));
            }
            catch (NotFoundException<User> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ICollection<UserDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await UserRepository.GetAll();

            return Ok(UserMapping.MapToDTOs(data));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditUser(string id, [FromBody] UpdateUserDTO dto)
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

            if (!loggedRoles.Contains("Admin") && currentUserId != id)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You can only edit your own account"
                });
            }

            var (user, _) = await UserRepository.GetById(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            using var transaction = await Context.Database.BeginTransactionAsync();

            try
            {
                if (!string.IsNullOrWhiteSpace(dto.FirstName))
                    user.FirstName = dto.FirstName;

                if (!string.IsNullOrWhiteSpace(dto.LastName))
                    user.LastName = dto.LastName;

                if (!string.IsNullOrWhiteSpace(dto.Phone))
                    user.PhoneNumber = dto.Phone;

                if (!string.IsNullOrWhiteSpace(dto.Email) && dto.Email != user.Email)
                {
                    // Check if the email is already taken
                    var existingUser = await UserManager.FindByEmailAsync(dto.Email);
                    if (existingUser != null && existingUser.Id != user.Id)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest("Email is already taken");
                    }

                    user.Email = dto.Email;
                    user.EmailConfirmed = false;
                }

                if (!string.IsNullOrWhiteSpace(dto.Username))
                    user.UserName = dto.Username;

                var result = await UserManager.UpdateAsync(user);
                if (!result.Succeeded)
                {
                    await transaction.RollbackAsync();
                    return BadRequest(result.Errors);
                }

                await Logger.LogAsync(user, currentUserId, DatabaseOperationType.Update);

                await transaction.CommitAsync();
                return Ok(UserMapping.MapToDTO(user, await UserManager.GetRolesAsync(user)));
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "An error occurred while updating the profile");
            }
        }

        [HttpPut("{id:guid}/password")]
        public async Task<IActionResult> ChangePassword(Guid id, [FromBody] ChangePasswordDTO dto)
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

            var (loggedUser, loggedRoles) = await UserRepository.GetById(currentUserId);

            if (!(loggedRoles.Contains("Admin") || loggedUser.Id == id.ToString()) || loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You can only edit your own account"
                });
            }

            var (user, roles) = await UserRepository.GetById(id.ToString());
            if (user == null)
            {
                return NotFound("User not found");
            }

            var result = await UserManager.ChangePasswordAsync(user, dto.OldPassword, dto.NewPassword);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await Logger.LogAsync(user, currentUserId, DatabaseOperationType.Update);

            return Ok(UserMapping.MapToDTO(user, roles));
        }

        // [HttpPost("add-role")]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> AddRole([FromBody] string role)
        // {
        //     if (!await RoleManager.RoleExistsAsync(role))
        //     {
        //         var result = await RoleManager.CreateAsync(new IdentityRole(role));
        //         if (result.Succeeded)
        //         {
        //             return Ok(new { message = "Role added successfully" });
        //         }

        //         return BadRequest(result.Errors);
        //     }

        //     return BadRequest("Role already exists");
        // }

        // [HttpPost("assign-role")]
        // [Authorize(Roles = "Admin")]
        // public async Task<IActionResult> AssignRole([FromBody] UserRoleDTO dto)
        // {
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     var user = await UserManager.FindByEmailAsync(dto.Email);
        //     if (user == null)
        //     {
        //         return BadRequest("User not found");
        //     }

        //     var result = await UserManager.AddToRoleAsync(user, dto.Role);
        //     if (result.Errors.Any())
        //     {
        //         return BadRequest(result.Errors);
        //     }

        //     // Get current user from JWT token
        //     var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        //     if (string.IsNullOrEmpty(currentUserId))
        //     {
        //         return Unauthorized("Invalid token");
        //     }

        //     await Logger.LogAsync(user, currentUserId, DatabaseOperationType.Update);

        //     return Ok(new { message = "Role assigned successfully" });

        // }
    }
}
