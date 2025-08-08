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
using SixLabors.ImageSharp;

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
        [Authorize]
        public async Task<IActionResult> GetAll([FromQuery] CompanyQueryParams requestParams)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, _) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await CompanyRepository.GetAllAsync(requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(CompanyMapping.MapToDTOs(data));
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetById(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, _) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in to access this resource."
                });
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
        [Authorize]
        public async Task<ActionResult<ICollection<UserDTO>>> GetAccountByCompany(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, _) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await UserRepository.GetByCompany(id);

            return Ok(UserMapping.MapToDTOs(data));
        }

        [HttpGet("{id}/products")]
        [Authorize]
        public async Task<ActionResult<PagedList<ProductDTO>>> GetProductsByCompany(string id, [FromQuery] ProductQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, _) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await ProductRepository.GetByCompany(id, requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(ProductMapping.MapToDTOs(data));
        }

        [HttpGet("{id}/pricelists")]
        [Authorize]
        public async Task<ActionResult<PagedList<PricelistDTO>>> GetPricelistsByCompany(string id, [FromQuery] PricelistQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, _) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await PricelistRepository.GetByCompanyAsync(id, requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(PricelistMapping.MapToDTOs(data));
        }

        [HttpGet("{id}/updatelists")]
        [Authorize]
        public async Task<ActionResult<PagedList<UpdateList>>> GetUpdateListsByCompany(string id, [FromQuery] UpdateListQueryParams requestParams)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, _) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null)
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in to access this resource."
                });
            }

            var data = await UpdateListRepository.GetByCompanyAsync(id, requestParams);

            Response.Headers["X-Pagination"] = JsonConvert.SerializeObject(MetadataMapping.MapToMetadata(data));

            return Ok(UpdateListMapping.MapToDTOs(data));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] CreateCompanyDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, loggedRoles) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null && !loggedRoles.Contains("Admin"))
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in as an Admin to create a company."
                });
            }

            try
            {

                // Handle logo upload if provided
                if (dto.Logo != null)
                {
                    // Validate image format
                    if (!dto.Logo.ContentType.Equals("image/png", StringComparison.OrdinalIgnoreCase))
                    {
                        return BadRequest("Logo must be a PNG image.");
                    }

                    // Validate image dimensions
                    using var stream = dto.Logo.OpenReadStream();
                    using var image = await Image.LoadAsync(stream);

                    if (image.Height <= 230)
                    {
                        return BadRequest("Logo height must be greater than 230 pixels.");
                    }

                    // Save the image
                    var publicImagesPath = Path.Combine(Directory.GetCurrentDirectory(), "public", "images");

                    // Create directory if it doesn't exist
                    if (!Directory.Exists(publicImagesPath))
                    {
                        Directory.CreateDirectory(publicImagesPath);
                    }

                    var fileName = $"{dto.Id}-Logo.png";
                    var filePath = Path.Combine(publicImagesPath, fileName);

                    // Reset stream position
                    stream.Position = 0;

                    // Save the image as PNG
                    await image.SaveAsPngAsync(filePath);

                    dto.LogoUri = "/images/" + fileName;
                }

                // Validate the DTO
                var data = CompanyMapping.MapToCompany(dto);
                var res = await CompanyRepository.CreateAsync(data);

                await Logger.LogAsync(res, currentUserId, DatabaseOperationType.Create);

                return Ok(CompanyMapping.MapToDTO(res));
            }
            catch (AlreadyExistException<Company> e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize]
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

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, loggedRoles) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null || !(loggedRoles.Contains("Admin") && loggedUser.CompanyId == id))
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be part of the company or an Admin to update it."
                });
            }

            try
            {
                var res = await CompanyRepository.UpdateAsync(dto);

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

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var (loggedUser, loggedRoles) = await UserRepository.GetById(currentUserId);

            if (loggedUser == null || !loggedRoles.Contains("Admin"))
            {
                return StatusCode(403, new
                {
                    error = "Forbidden",
                    message = "You need to be logged in as an Admin to delete a company."
                });
            }

            ProductRepository.BeginTransaction();

            try
            {
                Company company = await CompanyRepository.GetByIdAsync(id);

                this.DeletePricelists(company.Pricelists);

                var res = await CompanyRepository.DeleteAsync(id);

                // Todo: Deactivete instead of delete before enable the logging
                // await Logger.LogAsync(res, currentUserId, DatabaseOperationType.Delete);

                return Ok(CompanyMapping.MapToDTO(company));
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
            catch (Exception e)
            {
                ProductRepository.RollbackTransaction();
                return StatusCode(500, new
                {
                    error = "Deletion Error",
                    message = e.Message
                });
            }
        }

        private async void DeletePricelists(ICollection<Pricelist> pricelists)
        {
            foreach (var pricelist in pricelists)
            {
                // Delete ProductsToUpdateList
                foreach (var product in pricelist.Products)
                {
                    // Delete ProductsToUpdateList
                    await UpdateListRepository.DeleteProduct(product.Id);
                }

                PricelistRepository.ClearTracking();

                // Delete Pricelist
                await PricelistRepository.DeleteAsync(pricelist.Id);
            }
        }
    }
}
