using Asp.Versioning;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    [Route("api/v{version:apiVersion}/export")]
    public class ExportController : ControllerBase
    {
        private readonly ICompanyRepository CompanyRepository;
        private readonly IPricelistRepository PricelistRepository;
        private readonly IUpdateListRepository UpdateListRepository;
        private readonly IUserRepository UserRepository;

        private readonly IProductToUpdateListMappingService ProductToUpdateListMappingService;

        public ExportController(ICompanyRepository companyRepository, IPricelistRepository pricelistRepository, IUpdateListRepository updateListRepository, IProductToUpdateListMappingService productToUpdateListMappingService, IUserRepository userRepository)
        {
            UpdateListRepository = updateListRepository;
            CompanyRepository = companyRepository;
            PricelistRepository = pricelistRepository;
            ProductToUpdateListMappingService = productToUpdateListMappingService;
            UserRepository = userRepository;
        }

        [HttpGet("companies/{companyId}")]
        [Authorize]
        public async Task<IActionResult> ExportCompany(string companyId)
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
                    message = "You need to be logged in to download this resource."
                });
            }

            try
            {
                var data = await CompanyRepository.GetByIdAsync(companyId);

                var cc = new CsvConfiguration(new CultureInfo("it-IT"))
                {
                    HasHeaderRecord = true
                };
                using (var ms = new MemoryStream())
                {
                    using (var sw = new StreamWriter(stream: ms, encoding: new UTF8Encoding(true)))
                    {
                        using (var cw = new CsvWriter(sw, cc))
                        {
                            // Create a combined model for Company + Pricelist data
                            var exportData = new List<object>();

                            if (data.Pricelists != null && data.Pricelists.Any())
                            {
                                foreach (var pricelist in data.Pricelists)
                                {
                                    exportData.Add(new
                                    {
                                        // Company fields
                                        CompanyId = data.Id,
                                        CompanyName = data.Name,
                                        CompanyAddress = data.Address,
                                        CompanyPhone = data.Phone,

                                        // Pricelist fields
                                        PricelistId = pricelist.Id,
                                        PricelistName = pricelist.Name,
                                        PricelistDescription = pricelist.Description,
                                        TotalProducts = pricelist.Products?.Count ?? 0,
                                    });
                                }
                            }
                            else
                            {
                                // If no pricelists, export company data only
                                exportData.Add(new
                                {
                                    CompanyId = data.Id,
                                    CompanyName = data.Name,
                                    CompanyAddress = data.Address,
                                    CompanyPhone = data.Phone,
                                });
                            }

                            cw.WriteRecords(exportData);
                        }
                        return File(ms.ToArray(), "text/csv", $"export_company_{companyId}_{DateTime.UtcNow:yyyy_MM_dd_HH:mm}.csv");
                    }
                }
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }


        [HttpGet("pricelists/{pricelistId:guid}")]
        [Authorize]
        public async Task<IActionResult> ExportPricelist(Guid pricelistId)
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
                    message = "You need to be logged in to download this resource."
                });
            }

            try
            {
                var data = await PricelistRepository.GetByIdAsync(pricelistId);

                var cc = new CsvConfiguration(new CultureInfo("it-IT"))
                {
                    HasHeaderRecord = true
                };
                using (var ms = new MemoryStream())
                {
                    using (var sw = new StreamWriter(stream: ms, encoding: new UTF8Encoding(true)))
                    {
                        using (var cw = new CsvWriter(sw, cc))
                        {
                            // Create a combined model for Company + Pricelist data
                            var exportData = new List<object>();

                            if (data.Products != null && data.Products.Any())
                            {
                                foreach (var product in data.Products)
                                {
                                    exportData.Add(new
                                    {
                                        // Pricelist fields
                                        PricelistId = data.Id,
                                        PricelistName = data.Name,
                                        PricelistDescription = data.Description,
                                        Company = data.CompanyId,

                                        // Product fields
                                        ProductId = product.Id,
                                        ProductName = product.CurrentInstance?.Name,
                                        ProductVersion = product.LatestVersion,
                                        ProductDescription = product.CurrentInstance?.Description,
                                        ProductPrice = product.CurrentInstance?.Price,
                                        ProductCost = product.CurrentInstance?.Cost,
                                        ProductMargin = product.CurrentInstance?.Margin,
                                        ProductAccountingControl = product.CurrentInstance?.AccountingControl,
                                        ProductSalesItem = product.CurrentInstance?.SalesItem,
                                        ProductCDA = product.CurrentInstance?.CDA,
                                    });
                                }
                            }
                            else
                            {
                                // If no pricelists, export company data only
                                exportData.Add(new
                                {
                                    // Pricelist fields
                                    PricelistId = data.Id,
                                    PricelistName = data.Name,
                                    PricelistDescription = data.Description,
                                    Company = data.CompanyId,
                                });
                            }

                            cw.WriteRecords(exportData);
                        }
                        return File(ms.ToArray(), "text/csv", $"export_pricelist_{pricelistId}_{DateTime.UtcNow}.csv");
                    }
                }
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("updatelists/{updatelistId:int}")]
        [Authorize]
        public async Task<IActionResult> ExportUpdateList(int updatelistId)
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
                    message = "You need to be logged in to download this resource."
                });
            }

            try
            {
                var data = await UpdateListRepository.GetByIdAsync(updatelistId);

                var cc = new CsvConfiguration(new CultureInfo("it-IT"))
                {
                    HasHeaderRecord = true
                };
                using (var ms = new MemoryStream())
                {
                    using (var sw = new StreamWriter(stream: ms, encoding: new UTF8Encoding(true)))
                    {
                        using (var cw = new CsvWriter(sw, cc))
                        {
                            // Create a combined model for Company + Pricelist data
                            var exportData = new List<object>();

                            if (data.ProductsToUpdateLists != null && data.ProductsToUpdateLists.Any())
                            {
                                foreach (var productData in data.ProductsToUpdateLists)
                                {

                                    var product = ProductToUpdateListMappingService.MapToDTO(productData);

                                    exportData.Add(new
                                    {
                                        // UpdateList fields
                                        updatelistId = data.Id,
                                        UpdateListName = data.Name,
                                        UpdateListDescription = data.Description,
                                        Company = data.CompanyId,

                                        // Product fields
                                        ProductId = product.Id,
                                        ProductVersion = product.CurrentInstance.Version,
                                        ProductName = product.CurrentInstance?.Name,
                                        ProductDescription = product.CurrentInstance?.Description,
                                        PreviousProductPrice = product.PrevInstance?.Price,
                                        CurrentProductPrice = product.CurrentInstance?.Price,
                                        PreviousProductCost = product.PrevInstance?.Cost,
                                        CurrentProductCost = product.CurrentInstance?.Cost,
                                        ProductMargin = product.CurrentInstance?.Margin,
                                        ProductAccountingControl = product.CurrentInstance?.AccountingControl,
                                        ProductSalesItem = product.CurrentInstance?.SalesItem,
                                        ProductCDA = product.CurrentInstance?.CDA,
                                        ProductStatus = product.Status
                                    });
                                }
                            }
                            else
                            {
                                // If no pricelists, export company data only
                                exportData.Add(new
                                {
                                    // UpdateList fields
                                    updatelistId = data.Id,
                                    UpdateListName = data.Name,
                                    UpdateListDescription = data.Description,
                                    Company = data.CompanyId,
                                });
                            }

                            cw.WriteRecords(exportData);
                        }
                        return File(ms.ToArray(), "text/csv", $"export_updatelist_{updatelistId}_{DateTime.UtcNow}.csv");
                    }
                }
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }
    }
}