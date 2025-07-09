using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Mappers
{
    public class UpdateListLiteMappingService : IUpdateListLiteMappingService
    {
        public UpdateListLiteDTO MapToLiteDTO(UpdateList updateList)
        {
            ArgumentNullException.ThrowIfNull(updateList);

            return new UpdateListLiteDTO
            {
                Id = updateList.Id,
                CreatedAt = DateTime.Now,
                Description = updateList.Description,
                Status = updateList.Status,
                Name = updateList.Name,
                TotalProducts = updateList.ProductsToUpdateLists.Count,
                EditedProducts = updateList.ProductsToUpdateLists
                                            .Where(p => p.Status == Status.Edited)
                                            .Count()
            };
        }

        public ICollection<UpdateListLiteDTO> MapToLiteDTOs(ICollection<UpdateList> updateLists)
        {
            ArgumentNullException.ThrowIfNull(updateLists);

            return [.. updateLists.Select(ul => MapToLiteDTO(ul))];
        }
    }
}
