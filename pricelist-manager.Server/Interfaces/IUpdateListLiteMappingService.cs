using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUpdateListLiteMappingService
    {
        UpdateListLiteDTO MapToLiteDTO(UpdateList updateList);

        ICollection<UpdateListLiteDTO> MapToLiteDTOs(ICollection<UpdateList> updateLists);
    }
}
