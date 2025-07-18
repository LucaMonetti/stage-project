using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using System.Globalization;
using System.Security.Claims;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/companies")]
    [Authorize]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyRepository CompanyRepository;
        private readonly IProductRepository ProductRepository;
        private readonly IPricelistRepository PricelistRepository;
        private readonly IUpdateListRepository UpdateListRepository;
        private readonly IUserRepository UserRepository;
        private readonly ICompanyMappingService CompanyMapping;
        private readonly IProductMappingService ProductMapping;
        private readonly IPricelistMappingService PricelistMapping;
        private readonly IUserMappingService UserMapping;
        private readonly IMetadataMappingService MetadataMapping;
        private readonly IUpdateListMappingService UpdateListMapping;

        private readonly ILoggerRepository<Company> Logger;

        public CompaniesController(ICompanyRepository companyRepository, IUserRepository userRepository, IProductRepository productRepository, IPricelistRepository pricelistRepository, ICompanyMappingService companyMapping, IProductMappingService productMapping, IPricelistMappingService pricelistMapping, IUserMappingService userMapping, IMetadataMappingService metadataMapping, IUpdateListRepository updateListRepository, IUpdateListMappingService updateListMapping, ILoggerRepository<Company> logger)
        {
            CompanyRepository = companyRepository;
            UserRepository = userRepository;
            ProductRepository = productRepository;
            PricelistRepository = pricelistRepository;
            CompanyMapping = companyMapping;
            ProductMapping = productMapping;
            PricelistMapping = pricelistMapping;
            UserMapping = userMapping;
            MetadataMapping = metadataMapping;
            UpdateListRepository = updateListRepository;
            UpdateListMapping = updateListMapping;
            Logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CompanyQueryParams requestParams)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = await CompanyRepository.GetAllAsync(requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(CompanyMapping.MapToDTOs(data));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var data = await CompanyRepository.GetByIdAsync(id);
                return Ok(CompanyMapping.MapToDTO(data));
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("{id}/accounts")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ICollection<UserDTO>>> GetAccountByCompany(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await UserRepository.GetByCompany(id);

            return Ok(UserMapping.MapToDTOs(data));
        }

        [HttpGet("{id}/products")]
        public async Task<ActionResult<PagedList<ProductDTO>>> GetProductsByCompany(string id, [FromQuery] ProductQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await ProductRepository.GetByCompany(id, requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(ProductMapping.MapToDTOs(data));
        }

        [HttpGet("{id}/pricelists")]
        public async Task<ActionResult<PagedList<PricelistDTO>>> GetPricelistsByCompany(string id, [FromQuery] PricelistQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await PricelistRepository.GetByCompanyAsync(id, requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(PricelistMapping.MapToDTOs(data));
        }

        [HttpGet("{id}/updatelists")]
        public async Task<ActionResult<PagedList<UpdateList>>> GetUpdateListsByCompany(string id, [FromQuery] UpdateListQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = await UpdateListRepository.GetByCompanyAsync(id, requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(UpdateListMapping.MapToDTOs(data));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCompanyDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = CompanyMapping.MapToCompany(dto);

            try
            {
                var res = await CompanyRepository.CreateAsync(data);

                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized("Invalid token");
                }

                await Logger.LogAsync(res, currentUserId, DatabaseOperationType.Create);

                return Ok(CompanyMapping.MapToDTO(res));
            }
            catch (AlreadyExistException<Company> e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(string id, [FromBody] Company dto)
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
                var res = await CompanyRepository.UpdateAsync(dto);

                // Get current user from JWT token
                var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(currentUserId))
                {
                    return Unauthorized("Invalid token");
                }

                await Logger.LogAsync(res, currentUserId, DatabaseOperationType.Update);

                return Ok(CompanyMapping.MapToDTO(res));
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await CompanyRepository.DeleteAsync(id);

                // Todo: Deactivete instead of delete before enable the logging

                // // Get current user from JWT token
                // var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                // if (string.IsNullOrEmpty(currentUserId))
                // {
                //     return Unauthorized("Invalid token");
                // }

                // await Logger.LogAsync(res, currentUserId, DatabaseOperationType.Delete);

                return Ok(CompanyMapping.MapToDTO(res));
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
