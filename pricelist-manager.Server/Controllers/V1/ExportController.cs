using Asp.Versioning;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
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

        public ExportController(ICompanyRepository companyRepository)
        {
            CompanyRepository = companyRepository;
        }

        [HttpGet("companies/{companyId}")]
        public async Task<IActionResult> ExportCompany(string companyId)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
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
                        return File(ms.ToArray(), "text/csv", $"export_company_{companyId}_{DateTime.UtcNow}.csv");
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