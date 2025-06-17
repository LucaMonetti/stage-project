using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.Globalization;

namespace pricelist_manager.Server.Controllers
{
    [ApiController]
    [Route("api/pricelists")]
    public class PricelistsController: ControllerBase
    {
        private IPricelistRepository PricelistRepository;

        public PricelistsController(IPricelistRepository pricelistRepository)
        {
            PricelistRepository = pricelistRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var res = await PricelistRepository.GetAllAsync();

            return Ok(res);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await PricelistRepository.GetByIdAsync(id);
                return Ok(res);
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
