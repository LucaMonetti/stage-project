using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IPricelistLiteMappingService
    {
        PricelistLiteDTO MapToLiteDTO(Pricelist pricelist);

        ICollection<PricelistLiteDTO> MapToLiteDTOs(ICollection<Pricelist> pricelists);
    }
}
