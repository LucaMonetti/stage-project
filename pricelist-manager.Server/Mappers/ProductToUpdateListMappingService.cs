using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Mappers
{
    public class ProductToUpdateListMappingService : IProductToUpdateListMappingService
    {
        private readonly IProductInstanceMappingService ProductInstanceMappingService;

        public ProductToUpdateListMappingService(IProductInstanceMappingService productInstanceMappingService)
        {
            ProductInstanceMappingService = productInstanceMappingService;
        }

        public UpdateListProductDTO MapToDTO(Product product)
        {
            ArgumentNullException.ThrowIfNull(product);

            return new UpdateListProductDTO
            {
                Id = product.Id,
                LatestVersion = product.LatestVersion,
                CurrentInstance = ProductInstanceMappingService.MapToInstanceDTO(product.Versions.First(pi => pi.Version == product.LatestVersion))
            };
        }

        public ICollection<UpdateListProductDTO> MapToDTOs(ICollection<Product> products)
        {
            ArgumentNullException.ThrowIfNull(products);

            return [.. products.Select(p => MapToDTO(p))];
        }

        public ProductToUpdateList MapToModel(int updateListId, string productId)
        {
            return new ProductToUpdateList
            {
                ProductId = productId,
                UpdateListId = updateListId,
            };
        }

        public ICollection<ProductToUpdateList> MapToModels(int updateListId, ICollection<string> productIds)
        {
            return [.. productIds.Select(ul => MapToModel(updateListId, ul))];
        }

        public ICollection<ProductToUpdateList> MapToModels(AddProductsUpdateListDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            if (dto.ProductIds is null) 
                return [];

            return [.. dto.ProductIds.Select(ul => MapToModel(dto.Id, ul))];
        }
    }
}
