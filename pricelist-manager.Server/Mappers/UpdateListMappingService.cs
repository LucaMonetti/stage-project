using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace pricelist_manager.Server.Mappers
{
    public class UpdateListMappingService : IUpdateListMappingService
    {
        private readonly IProductToUpdateListMappingService ProductToUpdateListMappingService;

        public UpdateListMappingService(IProductToUpdateListMappingService productToUpdateListMappingService)
        {
            ProductToUpdateListMappingService = productToUpdateListMappingService;
        }

        public UpdateListDTO MapToDTO(UpdateList updateList)
        {
            ArgumentNullException.ThrowIfNull(updateList);

            return new UpdateListDTO
            {
                Id = updateList.Id,
                CreatedAt = DateTime.Now,
                Description = updateList.Description,
                Status = updateList.Status,
                Name = updateList.Name,
                Products = ProductToUpdateListMappingService.MapToDTOs(updateList.ProductsToUpdateLists.Select(ptul => ptul.Product).ToList() ?? []),
                TotalProducts = updateList.ProductsToUpdateLists.Count,
                EditedProducts = updateList.ProductsToUpdateLists
                                            .Where(p => p.Status == Status.Edited)
                                            .Count()
            };
        }

        public ICollection<UpdateListDTO> MapToDTOs(ICollection<UpdateList> updateLists)
        {
            ArgumentNullException.ThrowIfNull(updateLists);

            return [.. updateLists.Select(ul => MapToDTO(ul))];
        }

        public UpdateList MapToUpdateList(CreateUpdateListDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new UpdateList
            {
                Description = dto.Description,
                Name = dto.Name,
            };
        }
    }
}
