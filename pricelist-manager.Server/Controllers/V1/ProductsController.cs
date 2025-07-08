using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository ProductRepository;
        private readonly IPricelistRepository PricelistRepository;
        private readonly IProductInstanceRepository ProductInstanceRepository;
        private readonly IUpdateListRepository UpdateListRepository;
        private readonly IProductMappingService ProductMapping;
        private readonly IProductInstanceMappingService ProductInstanceMapping;

        public ProductsController(IProductRepository productRepository, IPricelistRepository pricelistRepository, IProductInstanceRepository productInstanceRepository, IProductMappingService productMapping, IProductInstanceMappingService productInstanceMapping, IUpdateListRepository updateListRepository)
        {
            ProductRepository = productRepository;
            PricelistRepository = pricelistRepository;
            ProductInstanceRepository = productInstanceRepository;
            ProductMapping = productMapping;
            ProductInstanceMapping = productInstanceMapping;
            UpdateListRepository = updateListRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = await ProductRepository.GetAllAsync();

            return Ok(ProductMapping.MapToDTOs(data));
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetById(string productId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetByIdAsync(productId);

                return Ok(ProductMapping.MapToDTO(data));
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


            try
            {
                Pricelist pricelist = await PricelistRepository.GetByIdAsync(dto.PricelistId);
                Product data = ProductMapping.MapToProduct(dto, pricelist.CompanyId);
                
                var res = await ProductRepository.CreateAsync(data);
                return Ok(res);
            }
            catch (AlreadyExistException<Product> e)
            {
                return Conflict(new { message = e.Message });
            }
            catch (NotFoundException<Pricelist> e)
            {
                return NotFound(new { message = e.Message });
            }
        }

        [HttpPut("{productId}")]
        public async Task<IActionResult> Update(string productId, [FromBody] UpdateProductDTO dto, [FromQuery] int? editUpdateList)
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

                ProductInstance newInstance = ProductInstanceMapping.MapToProductInstance(dto, oldProd.LatestVersion + 1);

                ProductRepository.ClearTracking();

                await ProductInstanceRepository.CreateAsync(newInstance);

                oldProd.LatestVersion = newInstance.Version;
                oldProd.Versions.Add(newInstance);

                var res = await ProductRepository.UpdateAsync(oldProd);

                if (editUpdateList != null)
                {
                    res &= await UpdateListRepository.UpdateProductStatusAsync(productId, editUpdateList.Value, Status.Edited);
                    
                    // Check if there are still products to edit
                    var products = await UpdateListRepository.GetProductsByStatus(editUpdateList.Value, Status.Pending);
                    if (products.Count == 0) 
                    {
                        var item = await UpdateListRepository.GetByIdAsync(editUpdateList.Value);

                        item.Status = Status.Edited;

                        res &= await UpdateListRepository.UpdateAsync(item);
                    }
                }

                return Ok(res);
            }
            catch (NotFoundException<Product> e)
            {
                return NotFound(e.Message);
            }
            catch (NotFoundException<UpdateList> e)
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
