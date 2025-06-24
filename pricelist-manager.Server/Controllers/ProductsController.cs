using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.DTOs;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;

namespace pricelist_manager.Server.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository ProductRepository;
        private readonly IProductInstanceRepository ProductInstanceRepository;

        public ProductsController(IProductRepository productRepository, IProductInstanceRepository productInstanceRepository)
        {
            ProductRepository = productRepository;
            ProductInstanceRepository = productInstanceRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<ProductWithPricelistDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = await ProductRepository.GetAllProductsWithPricelistsAsync();

            return Ok(ProductWithPricelistDTO.FromProducts(data));
        }
    }
}
