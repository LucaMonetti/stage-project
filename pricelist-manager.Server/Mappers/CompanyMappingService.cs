using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace pricelist_manager.Server.Mappers
{
    public class CompanyMappingService : ICompanyMappingService
    {
        private readonly IProductLiteMappingService ProductMapping;
        private readonly IPricelistLiteMappingService PricelistMapping;

        public CompanyMappingService(IProductLiteMappingService productMapping, IPricelistLiteMappingService pricelistMapping)
        {
            ProductMapping = productMapping;
            PricelistMapping = pricelistMapping;
        }

        public CompanyDTO MapToDTO(Company company)
        {
            ArgumentNullException.ThrowIfNull(company);

            return new CompanyDTO
            {
                Id = company.Id,
                Name = company.Name,
                Address = company.Address,
                InterfaceColor = company.InterfaceColor,
                LogoUri = company.LogoUri,
                Phone = company.Phone,
                PostalCode = company.PostalCode,
                Province = company.Province,
                Pricelists = PricelistMapping.MapToLiteDTOs(company.Pricelists),
                Products = ProductMapping.MapToLiteDTOs(company.Products)
            };
        }

        public Company MapToCompany(CreateCompanyDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new Company
            {
                Id = dto.Id.ToUpper(),
                Name = dto.Name,
                Address = dto.Address,
                InterfaceColor = dto.InterfaceColor,
                LogoUri = dto.LogoUri,
                Phone = dto.Phone,
                PostalCode = dto.PostalCode,
                Province = dto.Province
            };
        }

        public PagedList<CompanyDTO> MapToDTOs(PagedList<Company> companies)
        {
            ArgumentNullException.ThrowIfNull(companies);

            return new PagedList<CompanyDTO>([.. companies.Select(c => MapToDTO(c))], companies.TotalCount, companies.CurrentPage, companies.PageSize);
        }

        public Company MapToCompany(UpdateCompanyDTO dto, string logoUri)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new Company
            {
                Id = dto.Id.ToUpper(),
                Name = dto.Name,
                Address = dto.Address,
                InterfaceColor = dto.InterfaceColor,
                LogoUri = logoUri,
                Phone = dto.Phone,
                PostalCode = dto.PostalCode,
                Province = dto.Province
            };
        }
    }
}
