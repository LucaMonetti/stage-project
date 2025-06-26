using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IPricelistMappingService
    {
        PricelistDTO MapToDTO(Pricelist pricelist);

        ICollection<PricelistDTO> MapToDTOs(ICollection<Pricelist> pricelists);
    }
}
