using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.Data;
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
        private readonly DataContext Context;

        public PricelistsProductsController(IProductRepository productRepository, IProductInstanceRepository productInstanceRepository, IPricelistRepository pricelistRepository, DataContext context)
        {
            ProductRepository = productRepository;
            ProductInstanceRepository = productInstanceRepository;
            PricelistRepository = pricelistRepository;
            Context = context;
        }

        [HttpGet("{pricelistId:guid}/products")]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetAll(Guid pricelistId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetAllAsync(pricelistId);

                return Ok(ProductDTO.FromProducts(data));
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

                return Ok(ProductDTO.FromProduct(data));
            }
            catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("{pricelistId:guid}/products/{productCode}/versions")]
        public async Task<ActionResult<ProductDTO>> GetVersionsById(Guid pricelistId, string productCode)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetByIdAsync(pricelistId, productCode);

                return Ok(ProductDTO.FromProduct(data));
            }
            catch (NotFoundException<Product> e)
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
                //var res = await ProductInstanceRepository.CreateAsync(data.CurrentInstance);
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

            if (productCode != dto.ProductId)
            {
                ModelState.AddModelError("", "The IDs doesn't match!");
                return BadRequest(ModelState);
            }

            try
            {
                Product oldProd = await ProductRepository.GetByIdAsync(pricelistId, productCode.Split("-")[1]);

                ProductInstance newInstance = UpdateProductDTO.TurnIntoInstance(dto, oldProd.LatestVersion + 1);

                // Clear Context
                Context.ChangeTracker.Clear();

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
