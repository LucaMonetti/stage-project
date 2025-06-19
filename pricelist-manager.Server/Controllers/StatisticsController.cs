using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.Interfaces;

namespace pricelist_manager.Server.Controllers
{
    [ApiController]
    [Route("api/statistics")]
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
        public async Task<IActionResult> GetProductsStats()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await ProductsRepository.GetStatistics();

            return Ok(data);
        }
    }
}
