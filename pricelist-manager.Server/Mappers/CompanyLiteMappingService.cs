using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Mappers
{
    public class CompanyLiteMappingService : ICompanyLiteMappingService
    {
        public CompanyLiteDTO MapToLiteDTO(Company? company)
        {
            ArgumentNullException.ThrowIfNull(company);

            return new CompanyLiteDTO
            {
                Id = company.Id,
                Name = company.Name,
                Address = company.Address,
                InterfaceColor = company.InterfaceColor,
                LogoUri = company.LogoUri,
                Phone = company.Phone,
                PostalCode = company.PostalCode,
                Province = company.Province,
            };
        }

        public ICollection<CompanyLiteDTO> MapToLiteDTOs(ICollection<Company> companies)
        {
            ArgumentNullException.ThrowIfNull(companies);

            return [.. companies.Select(c => MapToLiteDTO(c))];
        }
    }
}
