using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.Interfaces;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/statistics")]
    [Authorize]
    public class StatisticsController : ControllerBase
    {
        private readonly IProductRepository ProductsRepository;
        private readonly IUserRepository UserRepository;
        private readonly ICompanyRepository CompanyRepository;
        private readonly IPricelistRepository PricelistRepository;

        public StatisticsController(IProductRepository productsRepository, IUserRepository userRepository, ICompanyRepository companyRepository, IPricelistRepository pricelistRepository)
        {
            ProductsRepository = productsRepository;
            UserRepository = userRepository;
            CompanyRepository = companyRepository;
            PricelistRepository = pricelistRepository;
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProductsStats(string? companyId)
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
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await ProductsRepository.GetStatistics(companyId);

            return Ok(data);
        }

        [HttpGet("companies")]
        public async Task<IActionResult> GetCompaniesStats()
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
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await CompanyRepository.GetStatistics();

            return Ok(data);
        }

        [HttpGet("accounts")]
        public async Task<IActionResult> GetAccountsStats()
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
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await UserRepository.GetStatistics();

            return Ok(data);
        }

        [HttpGet("pricelists")]
        public async Task<IActionResult> GetPricelistsStats(string? companyId)
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
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await PricelistRepository.GetStatistics(companyId);

            return Ok(data);
        }
    }
}
