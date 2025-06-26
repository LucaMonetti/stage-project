using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface ICompanyLiteMappingService
    {
        CompanyLiteDTO MapToLiteDTO(Company? company);

        ICollection<CompanyLiteDTO> MapToLiteDTOs(ICollection<Company> companies);
    }
}
