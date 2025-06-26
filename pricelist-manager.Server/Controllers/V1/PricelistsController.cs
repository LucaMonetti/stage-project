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
        private readonly DataContext Context;

        public PricelistsController(IPricelistRepository pricelistRepository, IProductRepository productRepository, DataContext context)
        {
            PricelistRepository = pricelistRepository;
            ProductRepository = productRepository;
            Context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<PricelistDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var res = await PricelistRepository.GetAllAsync();
            var prod = await ProductRepository.GetAllGroupPricelistAsync();

            return Ok(PricelistDTO.FromPricelists(res, prod));
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
                var prod = await ProductRepository.GetAllAsync(id);

                return Ok(PricelistDTO.FromPricelist(res, prod));
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
                var data = await ProductRepository.GetAllAsync(pricelistId);

                return Ok(ProductDTO.FromProducts(data));
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
