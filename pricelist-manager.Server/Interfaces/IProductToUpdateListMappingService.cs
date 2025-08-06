using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductToUpdateListMappingService
    {
        UpdateListProductDTO MapToDTO(ProductToUpdateList product);
        ProductToUpdateList MapToModel(int updateListId, string productId, Status status = Status.Pending);

        ICollection<UpdateListProductDTO> MapToDTOs(ICollection<ProductToUpdateList> products);


        ICollection<ProductToUpdateList> MapToModels(int updateListId, ICollection<string> productIds, Status status = Status.Pending);
        ICollection<ProductToUpdateList> MapToModels(AddProductsUpdateListDTO dto);
    }
}
