using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.Reflection.Metadata.Ecma335;
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
                CompanyId = updateList.CompanyId,
                Status = updateList.Status,
                Name = updateList.Name,
                Products = ProductToUpdateListMappingService.MapToDTOs(updateList.ProductsToUpdateLists),
                TotalProducts = updateList.ProductsToUpdateLists.Count,
                EditedProducts = updateList.ProductsToUpdateLists
                                            .Where(p => p.Status == Status.Edited)
                                            .Count()
            };
        }

        public PagedList<UpdateListDTO> MapToDTOs(PagedList<UpdateList> updateLists)
        {
            ArgumentNullException.ThrowIfNull(updateLists);

            return new PagedList<UpdateListDTO>([.. updateLists.Select(ul => MapToDTO(ul))], updateLists.TotalCount, updateLists.CurrentPage, updateLists.PageSize);
        }

        public UpdateList MapToUpdateList(CreateUpdateListDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new UpdateList
            {
                Description = dto.Description,
                CompanyId = dto.CompanyId,
                Name = dto.Name,
            };
        }

        public UpdateList MapToUpdateList(UpdateList model, UpdateUpdateListDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            model.Description = dto.Description ?? model.Description;
            model.Name = dto.Name ?? model.Name;
            model.Status = dto.Status ?? model.Status;

            return model;
        }

        public UpdateList MapToUpdateList(UpdateList model, UpdateListStatusDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            model.Status = dto.Status;

            return model;
        }
    }
}
