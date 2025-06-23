using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.DTOs;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;

namespace pricelist_manager.Server.Controllers
{
    [ApiController]
    [Route("api/pricelists")]
    public class PricelistsProductsController : ControllerBase
    {
        private readonly IProductRepository ProductRepository;
        private readonly IPricelistRepository PricelistRepository;
        private readonly IProductInstanceRepository ProductInstanceRepository;

        public PricelistsProductsController(IProductRepository productRepository, IProductInstanceRepository productInstanceRepository, IPricelistRepository pricelistRepository)
        {
            ProductRepository = productRepository;
            ProductInstanceRepository = productInstanceRepository;
            PricelistRepository = pricelistRepository;
        }

        [HttpGet("{pricelistId:guid}/products")]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetAll(Guid pricelistId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetAllAsync(pricelistId);
                var pricelist = await PricelistRepository.GetByIdAsync(pricelistId);

                return Ok(ProductDTO.FromProducts(data, pricelist.CompanyId));
            }
            catch (NotFoundException<Pricelist> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("{pricelistId:guid}/products/{productCode}")]
        public async Task<ActionResult<ProductDTO>> GetById(Guid pricelistId, string productCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetByIdAsync(pricelistId, productCode);
                var pricelist = await PricelistRepository.GetByIdAsync(pricelistId);

                return Ok(ProductDTO.FromProduct(data, pricelist.CompanyId));
            }
            catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
            catch (NotFoundException<Pricelist> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDTO dto)
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
            } catch (AlreadyExistException<Product> e)
            {
                return Conflict(new { message = e.Message});
            }
        }

        [HttpPut("{pricelistId:guid}/products/{productCode}")]
        public async Task<IActionResult> UpdateProduct(Guid pricelistId, string productCode, [FromBody] UpdateProductDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (pricelistId != dto.PricelistId || productCode != dto.ProductCode)
            {
                ModelState.AddModelError("", "The IDs doesn't match!");
                return BadRequest(ModelState);
            }

            try
            {
                Product oldProd = await ProductRepository.GetByIdAsync(pricelistId, productCode);
                ProductInstance newInstance = UpdateProductDTO.MergeDTO(oldProd.Versions.Last(), dto);

                await ProductInstanceRepository.CreateAsync(newInstance);

                oldProd.LatestVersion = newInstance.Version;    

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

        [HttpDelete("{pricelistId:guid}/products/{productCode}")]
        public async Task<IActionResult> Delete(Guid pricelistId, string productCode)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await ProductRepository.DeleteAsync(pricelistId, productCode);
                return Ok(res);
            } catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
