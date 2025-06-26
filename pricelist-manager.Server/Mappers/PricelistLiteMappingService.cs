using Microsoft.VisualBasic;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace pricelist_manager.Server.Mappers
{
    public class PricelistLiteMappingService : IPricelistLiteMappingService
    {
        public PricelistLiteDTO MapToLiteDTO(Pricelist pricelist)
        {
            ArgumentNullException.ThrowIfNull(pricelist);

            return new PricelistLiteDTO
            {
                Id = pricelist.Id,
                Name = pricelist.Name,
                Description = pricelist.Description,
            };
        }

        public ICollection<PricelistLiteDTO> MapToLiteDTOs(ICollection<Pricelist> pricelists)
        {
            ArgumentNullException.ThrowIfNull(pricelists);

            return [.. pricelists.Select(p => MapToLiteDTO(p))];
        }
    }
}
