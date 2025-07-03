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
    [Route("api/v{version:apiVersion}/updatelists")]
    public class UpdateListController : ControllerBase
    {
        private readonly IUpdateListRepository UpdateListRepository;
        private readonly IProductRepository ProductRepository;
        private readonly IProductToUpdateListMappingService ProductToUpdateListMappingService;
        private readonly IUpdateListMappingService UpdateListMappingService;

        public UpdateListController(IUpdateListRepository updateListRepository, IProductRepository productRepository, IUpdateListMappingService updateListMappingService, IProductToUpdateListMappingService productToUpdateListMappingService)
        {
            UpdateListRepository = updateListRepository;
            ProductRepository = productRepository;
            UpdateListMappingService = updateListMappingService;
            ProductToUpdateListMappingService = productToUpdateListMappingService;
        }

        [HttpGet]
        public async Task<ActionResult<ICollection<UpdateListDTO>>> GetAll()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await UpdateListRepository.GetAllAsync();

            return Ok(UpdateListMappingService.MapToDTOs(data));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDTO>> GetById(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var data = await UpdateListRepository.GetByIdAsync(id);
                return Ok(UpdateListMappingService.MapToDTO(data));
            }
            catch (NotFoundException<UpdateList> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUpdateListDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Create UpdateList
                var item = await UpdateListRepository.CreateAsync(UpdateListMappingService.MapToUpdateList(dto)); 

                // Add Products To List
                var res = UpdateListRepository.AddProducts(ProductToUpdateListMappingService.MapToModels(item.Id, dto.Products ?? []));

                return base.Ok(res);
            }
            catch (Exceptions.AlreadyExistException<UpdateList> e)
            {
                return base.Conflict(e.Message);
            }
            catch (Exceptions.AlreadyExistException<ProductToUpdateList> e)
            {
                return base.Conflict(e.Message);
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateUpdateListDTO dto)
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
                var item = await UpdateListRepository.GetByIdAsync(id);

                var model = UpdateListMappingService.MapToUpdateList(item, dto);

                var res = await UpdateListRepository.UpdateAsync(model);
                return Ok(res);
            }
            catch (NotFoundException<UpdateList> e)
            {
                return NotFound(e.Message);
            }
        }

        //[HttpDelete("{id:guid}")]
        //public async Task<IActionResult> DeleteProduct(Guid id)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    try
        //    {
        //        var res = await PricelistRepository.DeleteAsync(id);
        //        return Ok(res);
        //    }
        //    catch (NotFoundException<Company> e)
        //    {
        //        return NotFound(e.Message);
        //    }
        //}

    }
}
