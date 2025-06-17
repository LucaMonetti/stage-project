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
    [Route("api/pricelists/{pricelistId:guid}/products")]
    public class PricelistsProductsController : ControllerBase
    {
        private readonly IProductRepository ProductRepository;
        private readonly IProductInstanceRepository ProductInstanceRepository;

        public PricelistsProductsController(IProductRepository productRepository, IProductInstanceRepository productInstanceRepository)
        {
            ProductRepository = productRepository;
            ProductInstanceRepository = productInstanceRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(Guid pricelistId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = await ProductRepository.GetAllAsync(pricelistId);

            return Ok(data);
        }

        [HttpGet("{productCode}")]
        public async Task<IActionResult> GetById(Guid pricelistId, string productCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetByIdAsync(pricelistId, productCode);
                return Ok(data);
            }
            catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost("{productCode}")]
        public async Task<IActionResult> CreateProduct(Guid pricelistId, string productCode, [FromBody] CreateProductDTO dto)
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

            Product data = CreateProductDTO.ToProduct(dto);

            try
            {
                var res = await ProductRepository.CreateAsync(data);
                return Ok(res);
            } catch (AlreadyExistException<Product> e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPut("{productCode}")]
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
                ProductInstance newInstance = UpdateProductDTO.MergeDTO(oldProd.Instance, dto);

                await ProductInstanceRepository.CreateAsync(newInstance);

                oldProd.LatestVersion += 1;

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
    }
}
