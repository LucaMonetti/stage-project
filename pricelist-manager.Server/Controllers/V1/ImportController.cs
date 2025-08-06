using Asp.Versioning;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Update.Internal;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Mappers;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using System.Collections;
using System.Globalization;
using System.Security.Claims;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Authorize]
    [Route("api/v{version:apiVersion}/import")]
    public class ImportController : ControllerBase
    {
        private readonly ICompanyRepository CompanyRepository;
        private readonly IPricelistRepository PricelistRepository;
        private readonly IProductRepository ProductRepository;
        private readonly IUpdateListRepository UpdateListRepository;
        private readonly IProductMappingService ProductMapping;
        private readonly IUserRepository UserRepository;
        private readonly IProductInstanceMappingService ProductInstanceMappingService;
        private readonly IProductInstanceRepository ProductInstanceRepository;
        private readonly IProductToUpdateListMappingService ProductToUpdateListMappingService;
        private readonly ILoggerRepository<UpdateList> LoggerUpdateList;
        private readonly ILoggerRepository<Pricelist> LoggerPricelist;

        public ImportController(ICompanyRepository companyRepository, IPricelistRepository pricelistRepository, IProductRepository productRepository, IUpdateListRepository updateListRepository, IProductMappingService productMapping, IUserRepository userRepository, IProductInstanceMappingService productInstanceMappingService, IProductToUpdateListMappingService productToUpdateListMappingService, IProductInstanceRepository productInstanceRepository, ILoggerRepository<UpdateList> loggerUpdateList, ILoggerRepository<Pricelist> loggerPricelist)
        {
            UpdateListRepository = updateListRepository;
            ProductMapping = productMapping;
            CompanyRepository = companyRepository;
            PricelistRepository = pricelistRepository;
            LoggerUpdateList = loggerUpdateList;
            LoggerPricelist = loggerPricelist;
            UserRepository = userRepository;
            ProductRepository = productRepository;
            ProductInstanceMappingService = productInstanceMappingService;
            ProductToUpdateListMappingService = productToUpdateListMappingService;
            ProductInstanceRepository = productInstanceRepository;
        }

        [HttpPost("pricelists/{pricelistId:guid}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPricelist(IFormFile file, Guid pricelistId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            if (!Path.GetExtension(file.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Only .csv files are allowed.");
            }

            var pricelist = await PricelistRepository.GetByIdAsync(pricelistId);

            if (pricelist == null)
            {
                return NotFound($"Pricelist with ID {pricelistId} not found.");
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            try
            {
                List<ProductCsvDTO> records;
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    var config = new CsvConfiguration(CultureInfo.GetCultureInfo("it-IT"))
                    {
                        HasHeaderRecord = true,
                        PrepareHeaderForMatch = args => args.Header.ToLowerInvariant(),
                        Delimiter = ";"
                    };
                    using (var csv = new CsvReader(reader, config))
                    {
                        csv.Context.RegisterClassMap<ProductCsvRecordMap>();

                        records = csv.GetRecords<ProductCsvDTO>().ToList();
                    }
                }

                if (records.Count == 0)
                {
                    return BadRequest("No records found in the CSV file.");
                }

                await ProductRepository.ImportProductsAsync(ProductMapping.MapToProducts(records, pricelist, currentUserId), pricelist.CompanyId);

                await LoggerPricelist.LogAsync(pricelist, currentUserId, DatabaseOperationType.UpdateInnerProducts);
                return Ok();
            }
            catch (BadDataException ex)
            {
                // Handle specific CSV parsing errors
                return BadRequest($"Error parsing CSV: {ex.Message}. Please check file format.");
            }
            catch (Exception ex)
            {
                // Handle other potential errors
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost("updatelists/{updatelistId:int}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportUpdateList(IFormFile file, int updatelistId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            if (!Path.GetExtension(file.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Only .csv files are allowed.");
            }

            UpdateList updatelist;

            try
            {
                updatelist = await UpdateListRepository.GetByIdAsync(updatelistId);
            }
            catch (NotFoundException<UpdateList> e)
            {
                return NotFound(e.Message);
            }

            // Get current user from JWT token
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("Invalid token");
            }

            var currentUser = await UserRepository.GetById(currentUserId);

            try
            {
                List<UpdateListCsvDTO> records;
                using (var reader = new StreamReader(file.OpenReadStream()))
                {
                    var config = new CsvConfiguration(CultureInfo.GetCultureInfo("it-IT"))
                    {
                        HasHeaderRecord = true,
                        PrepareHeaderForMatch = args => args.Header.ToLowerInvariant(),
                        Delimiter = ";"

                    };
                    using (var csv = new CsvReader(reader, config))
                    {
                        csv.Context.RegisterClassMap<UpdateListCsvMapper>();

                        records = csv.GetRecords<UpdateListCsvDTO>().ToList();
                    }
                }

                if (records.Count == 0)
                {
                    return BadRequest("No records found in the CSV file.");
                }

                UpdateListRepository.BeginTransaction();

                // Get existing products in the update list
                var existingProducts = await UpdateListRepository.GetAllProductsByList(updatelistId);
                var existingIds = existingProducts.Select(p => p.ProductId).ToHashSet();

                var companyProducts = await ProductRepository.GetByCompany(updatelist.CompanyId, null);
                var companyProductIds = companyProducts.Select(p => p.Id).ToHashSet();

                // Split records into updated and not updated
                ICollection<string> productsToUpdate = [];
                ICollection<(ProductInstance instance, Product product)> productsUpdated = [];

                int notUpdatedCount = 0;

                foreach (var record in records)
                {
                    // Handle existing products in updatelist
                    if (existingIds.Contains(record.ProductId) || !companyProductIds.Contains(record.ProductId))
                    {
                        notUpdatedCount++;
                        continue;
                    }

                    try
                    {
                        Product product = await ProductRepository.GetByIdAsync(record.ProductId);

                        if (product.CurrentInstance == null)
                        {
                            notUpdatedCount++;
                            continue;
                        }

                        // Get all properties from the DTO record
                        var dtoProperties = typeof(UpdateListCsvDTO).GetProperties();
                        bool hasChanges = false;

                        foreach (var dtoProp in dtoProperties)
                        {
                            // Skip ProductId as it's the identifier
                            if (dtoProp.Name == nameof(record.ProductId)) continue;

                            var dtoValue = dtoProp.GetValue(record);

                            // Skip null or empty values
                            if (dtoValue == null || (dtoValue is string str && string.IsNullOrEmpty(str)))
                                continue;

                            // Get corresponding property from CurrentInstance
                            var productProp = typeof(ProductInstance).GetProperty(dtoProp.Name);
                            if (productProp != null)
                            {
                                var productValue = productProp.GetValue(product.CurrentInstance);

                                if (!Equals(dtoValue, productValue))
                                {
                                    hasChanges = true;
                                    break;
                                }
                            }
                        }

                        if (!hasChanges)
                        {
                            productsToUpdate.Add(product.Id);
                        }
                        else
                        {
                            productsUpdated.Add((ProductInstanceMappingService.MapToProductInstance(record, product.Versions.First(v => v.Version == product.LatestVersion), currentUser.user.Id), product));
                            product.LatestVersion++;
                        }
                    }
                    catch (NotFoundException<Product>)
                    {
                        notUpdatedCount++;
                        continue;
                    }
                }

                // Handle products that need to be updated
                var res = await UpdateListRepository.AddProducts(ProductToUpdateListMappingService.MapToModels(updatelistId, productsToUpdate));

                bool completed = res.Count == productsToUpdate.Count;

                // Handle products that were updated
                var res2 = await ProductInstanceRepository.CreateListAsync(productsUpdated.Select(p => p.instance).ToList());
                var res3 = await ProductRepository.UpdateListAsync(productsUpdated.Select(p => p.product).ToList());

                var res4 = await UpdateListRepository.AddProducts(ProductToUpdateListMappingService.MapToModels(updatelistId, productsUpdated.Select(p => p.product.Id).ToList(), Status.Edited));

                completed = completed
                    && res2.Count == productsUpdated.Count
                    && res3.Count == productsUpdated.Count
                    && res4.Count == productsUpdated.Count;

                if (!completed)
                {
                    UpdateListRepository.RollbackTransaction();
                    return StatusCode(500, "An error occurred while processing the update list.");
                }

                await LoggerUpdateList.LogAsync(updatelist, currentUserId, DatabaseOperationType.UpdateInnerProducts);

                UpdateListRepository.CommitTransaction();
                return Ok();
            }
            catch (BadDataException ex)
            {
                // Handle specific CSV parsing errors
                return BadRequest($"Error parsing CSV: {ex.Message}. Please check file format.");
            }
            catch (Exception ex)
            {
                // Handle other potential errors
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}