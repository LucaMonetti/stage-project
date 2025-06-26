using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using System.Globalization;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/pricelists")]
    public class PricelistsController: ControllerBase
    {
        private readonly IPricelistRepository PricelistRepository;
        private readonly IProductRepository ProductRepository;

        private readonly IProductMappingService ProductMapping;
        private readonly IPricelistMappingService PricelistMapping;

        public PricelistsController(IPricelistRepository pricelistRepository, IProductRepository productRepository, IPricelistMappingService pricelistMappingService, IProductMappingService productMappingService )
        {
            PricelistRepository = pricelistRepository;
            ProductRepository = productRepository;
            ProductMapping = productMappingService;
            PricelistMapping = pricelistMappingService;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<PricelistDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var res = await PricelistRepository.GetAllAsync();

            return Ok(PricelistMapping.MapToDTOs(res));
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<PricelistDTO>> GetById(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await PricelistRepository.GetByIdAsync(id);

                return Ok(PricelistMapping.MapToDTO(res));
            }
            catch (NotFoundException<Pricelist> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("{pricelistId:guid}/products")]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetAll(Guid pricelistId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var res = await ProductRepository.GetByPricelistAsync(pricelistId);

                return Ok(ProductMapping.MapToDTOs(res));
            }
            catch (NotFoundException<Pricelist> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Pricelist dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = dto;

            try
            {
                var res = await PricelistRepository.CreateAsync(data);
                return Ok(res);
            }
            catch (AlreadyExistException<Pricelist> e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] Pricelist dto)
        {
            if (id != dto.Id)
            {
                ModelState.AddModelError("", "The IDs doesn't match!");
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await PricelistRepository.UpdateAsync(dto);
                return Ok(res);
            }
            catch (NotFoundException<Pricelist> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeleteProduct(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await PricelistRepository.DeleteAsync(id);
                return Ok(res);
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
