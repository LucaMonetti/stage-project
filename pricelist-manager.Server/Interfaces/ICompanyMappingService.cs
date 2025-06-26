using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface ICompanyMappingService
    {
        CompanyDTO MapToDTO(Company company);
        ICollection<CompanyDTO> MapToDTOs(ICollection<Company> companies);
    }
}
