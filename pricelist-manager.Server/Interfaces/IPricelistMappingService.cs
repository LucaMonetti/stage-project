using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IPricelistMappingService
    {
        PricelistDTO MapToDTO(Pricelist pricelist);
        Pricelist MapToPricelist(CreatePricelistDTO pricelist);
        Pricelist MapToPricelist(UpdatePricelistDTO pricelist);
        PagedList<PricelistDTO> MapToDTOs(PagedList<Pricelist> pricelists);
    }
}
