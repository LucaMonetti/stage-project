using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUpdateListMappingService
    {
        UpdateListDTO MapToDTO(UpdateList updateList);
        UpdateList MapToUpdateList(CreateUpdateListDTO dto);
        UpdateList MapToUpdateList(UpdateList old, UpdateUpdateListDTO dto);

        ICollection<UpdateListDTO> MapToDTOs(ICollection<UpdateList> updateLists);
    }
}
