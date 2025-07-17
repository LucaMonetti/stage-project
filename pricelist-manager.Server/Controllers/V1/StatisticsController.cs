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

            var data = await PricelistRepository.GetStatistics(companyId);

            return Ok(data);
        }
    }
}
