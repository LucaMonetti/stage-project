using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/products")]
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
        public async Task<ActionResult<ICollection<ProductDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = await ProductRepository.GetAllProductsWithPricelistsAsync();

            return Ok(ProductDTO.FromProducts(data));
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetById(string productId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetByIdAsync(productId);

                return Ok(ProductDTO.FromProduct(data));
            }
            catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ICollection<ProductDTO>>> Create([FromBody] CreateProductDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Product data = CreateProductDTO.ToProduct(dto);

            try
            {
                var res = await ProductRepository.CreateAsync(data);
                return Ok(res);
            }
            catch (AlreadyExistException<Product> e)
            {
                return Conflict(new { message = e.Message });
            }
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> Update(string productId, [FromBody] UpdateProductDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (productId != dto.ProductId)
            {
                ModelState.AddModelError("", "The IDs doesn't match!");
                return BadRequest(ModelState);
            }

            try
            {
                Product oldProd = await ProductRepository.GetByIdAsync(productId);

                ProductInstance newInstance = UpdateProductDTO.TurnIntoInstance(dto, oldProd.LatestVersion + 1);

                ProductRepository.ClearTracking();

                await ProductInstanceRepository.CreateAsync(newInstance);

                oldProd.LatestVersion = newInstance.Version;
                oldProd.Versions.Add(newInstance);

                var res = await ProductRepository.UpdateAsync(oldProd);
                return Ok(res);
            }
            catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
            catch (AlreadyExistException<ProductInstance> e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> Delete(string productId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await ProductRepository.DeleteAsync(productId);
                return Ok(res);
            }
            catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
