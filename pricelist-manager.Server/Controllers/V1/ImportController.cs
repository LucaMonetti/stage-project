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

        public ImportController(ICompanyRepository companyRepository, IPricelistRepository pricelistRepository, IProductRepository productRepository, IUpdateListRepository updateListRepository, IProductMappingService productMapping)
        {
            UpdateListRepository = updateListRepository;
            ProductMapping = productMapping;
            CompanyRepository = companyRepository;
            PricelistRepository = pricelistRepository;
            ProductRepository = productRepository;
        }

        [HttpPost("pricelists/{pricelistId:guid}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportPricelist(IFormFile file, Guid pricelistId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("File is required.");
            }

            // Optional: Validate file type
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
                    var config = new CsvConfiguration(CultureInfo.InvariantCulture)
                    {
                        HasHeaderRecord = true,
                        PrepareHeaderForMatch = args => args.Header.ToLowerInvariant()
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