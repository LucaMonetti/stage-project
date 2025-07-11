using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using System.Globalization;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
        private readonly IMetadataMappingService MetadataMapping;

        public PricelistsController(IPricelistRepository pricelistRepository, IProductRepository productRepository, IPricelistMappingService pricelistMappingService, IProductMappingService productMappingService, IMetadataMappingService metadataMapping)
        {
            PricelistRepository = pricelistRepository;
            ProductRepository = productRepository;
            ProductMapping = productMappingService;
            PricelistMapping = pricelistMappingService;
            MetadataMapping = metadataMapping;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<PricelistDTO>>> GetAll([FromQuery] PricelistQueryParams requestParams)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = await PricelistRepository.GetAllAsync(requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(PricelistMapping.MapToDTOs(data));
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
        public async Task<ActionResult<PagedList<ProductDTO>>> GetAll(Guid pricelistId, [FromQuery] ProductQueryParams requestParams)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var data = await ProductRepository.GetByPricelistAsync(pricelistId, requestParams);

                Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

                return Ok(ProductMapping.MapToDTOs(data));
            }
            catch (NotFoundException<Pricelist> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePricelistDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = PricelistMapping.MapToPricelist(dto);

            try
            {
                var res = await PricelistRepository.CreateAsync(data);
                return Ok(PricelistMapping.MapToDTO(res));
            }
            catch (AlreadyExistException<Pricelist> e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdatePricelistDTO dto)
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
                var res = await PricelistRepository.UpdateAsync(PricelistMapping.MapToPricelist(dto));
                return Ok(PricelistMapping.MapToDTO(res));
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
                return Ok(PricelistMapping.MapToDTO(res));
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
