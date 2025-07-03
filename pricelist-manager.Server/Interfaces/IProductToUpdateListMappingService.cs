using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductToUpdateListMappingService
    {
        UpdateListProductDTO MapToDTO(Product product);
        ProductToUpdateList MapToModel(int updateListId, string productId);

        ICollection<UpdateListProductDTO> MapToDTOs(ICollection<Product> products);


        ICollection<ProductToUpdateList> MapToModels(int updateListId, ICollection<string> productIds);
        ICollection<ProductToUpdateList> MapToModels(AddProductsUpdateListDTO dto);
    }
}
