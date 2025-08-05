using System.Security.Claims;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Mappers;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/updatelists")]
    [Authorize]
    public class UpdateListController : ControllerBase
    {
        private readonly IUpdateListRepository UpdateListRepository;
        private readonly IProductRepository ProductRepository;
        private readonly IProductToUpdateListMappingService ProductToUpdateListMappingService;
        private readonly IProductMappingService ProductMappingService;
        private readonly IUpdateListMappingService UpdateListMappingService;
        private readonly IMetadataMappingService MetadataMapping;

        private readonly ILoggerRepository<UpdateList> Logger;

        public UpdateListController(IUpdateListRepository updateListRepository, IProductRepository productRepository, IUpdateListMappingService updateListMappingService, IProductToUpdateListMappingService productToUpdateListMappingService, IMetadataMappingService metadataMapping, IProductMappingService productMappingService, ILoggerRepository<UpdateList> logger)
        {
            UpdateListRepository = updateListRepository;
            ProductRepository = productRepository;
            Logger = logger;
            UpdateListMappingService = updateListMappingService;
            ProductToUpdateListMappingService = productToUpdateListMappingService;
            MetadataMapping = metadataMapping;
            ProductMappingService = productMappingService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<UpdateListDTO>>> GetAll([FromQuery] UpdateListQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await UpdateListRepository.GetAllAsync(requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

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

        [HttpGet("{id:int}/products")]
        public async Task<ActionResult<ProductDTO>> GetProductsById(int id, [FromQuery] UpdateListQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var data = await UpdateListRepository.GetProductsByList(id, requestParams);
                return Ok(ProductToUpdateListMappingService.MapToDTOs(data));
            }
            catch (NotFoundException<UpdateList> e)
            {
                return NotFound(e.Message);
            }
        }
        [HttpGet("{id:int}/available-products")]
        public async Task<ActionResult<ProductDTO>> GetAvailableProductsById(int id, [FromQuery] ProductQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var data = await UpdateListRepository.GetAvailableProducts(id, requestParams);

                Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

                return Ok(ProductMappingService.MapToDTOs(data));
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
                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized("Invalid token");
                }

                // Create UpdateList
                var item = await UpdateListRepository.CreateAsync(UpdateListMappingService.MapToUpdateList(dto));
                await Logger.LogAsync(item, currentUserId, DatabaseOperationType.Create);

                // Add Products To List
                var res = await UpdateListRepository.AddProducts(ProductToUpdateListMappingService.MapToModels(item.Id, dto.Products ?? []));
                await Logger.LogAsync(item, currentUserId, DatabaseOperationType.UpdateInnerProducts);

                return base.Ok(UpdateListMappingService.MapToDTO(item));
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

        [HttpPut("{id:int}/products")]
        public async Task<IActionResult> AddProducts(int id, [FromBody] AddProductsUpdateListDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Sync products list
                var existingProducts = await UpdateListRepository.GetProductsByList(id);
                var existingProductIds = existingProducts.Select(p => p.ProductId).ToHashSet();

                var newProducts = ProductToUpdateListMappingService.MapToModels(dto.Id, dto.ProductIds ?? []);
                var newProductIDs = dto.ProductIds?.ToHashSet();

                var productsToAdd = newProducts
                    .Where(p => !existingProductIds.Contains(p.ProductId))
                    .ToList();

                await UpdateListRepository.AddProducts(productsToAdd);

                // Update status of update list
                var products = await UpdateListRepository.GetProductsByStatus(id, Status.Pending);
                var updatelist = await UpdateListRepository.GetByIdAsync(id);

                if (products.Count != 0 && updatelist.Status != Status.Pending)
                {
                    updatelist.Status = Status.Pending;
                    await UpdateListRepository.UpdateAsync(updatelist);
                }

                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized("Invalid token");
                }

                await Logger.LogAsync(updatelist, currentUserId, DatabaseOperationType.UpdateInnerProducts);

                return base.Ok(UpdateListMappingService.MapToDTO(updatelist));
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

        [HttpDelete("{id:int}/products")]
        public async Task<IActionResult> RemoveProducts(int id, [FromQuery] RemoveProductUpdateListDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Check if the update list exists
                var updatelist = await UpdateListRepository.GetByIdAsync(id);

                await UpdateListRepository.DeleteProductAndUpdateStatus(id, dto.ProductId);

                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized("Invalid token");
                }

                await Logger.LogAsync(updatelist, currentUserId, DatabaseOperationType.UpdateInnerProducts);

                return base.NoContent();
            }
            catch (NotFoundException<UpdateList> e)
            {
                return base.NotFound(e.Message);
            }
            catch (NotFoundException<ProductToUpdateList> e)
            {
                return base.NotFound(e.Message);
            }
            catch (AlreadyExistException<UpdateList> e)
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

                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized("Invalid token");
                }

                await Logger.LogAsync(res, currentUserId, DatabaseOperationType.Update);

                return Ok(item);
            }
            catch (NotFoundException<UpdateList> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPut("{id:int}/status")]
        public async Task<IActionResult> UpdateListStatus(int id, [FromBody] UpdateListStatusDTO dto)
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

                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized("Invalid token");
                }

                await Logger.LogAsync(res, currentUserId, DatabaseOperationType.Update);

                return Ok(UpdateListMappingService.MapToDTO(res));
            }
            catch (NotFoundException<UpdateList> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteList(int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var item = await UpdateListRepository.DeleteAsync(id);

                // Todo: Disable instead of delete

                // // Get current user from JWT token
                // var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // if (string.IsNullOrEmpty(currentUserId))
                // {
                //     return Unauthorized("Invalid token");
                // }

                // await Logger.LogAsync(item, currentUserId, DatabaseOperationType.Delete);

                return Ok(UpdateListMappingService.MapToDTO(item));
            }
            catch (NotFoundException<UpdateList> e)
            {
                return NotFound(e.Message);
            }
        }

    }
}
