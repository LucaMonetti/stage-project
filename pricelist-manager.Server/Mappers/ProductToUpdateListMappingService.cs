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

        public UpdateListProductDTO MapToDTO(ProductToUpdateList product)
        {
            ArgumentNullException.ThrowIfNull(product);

            return new UpdateListProductDTO
            {
                Id = product.Product.Id,
                LatestVersion = product.Product.LatestVersion,
                Status = product.Status,
                CurrentInstance = ProductInstanceMappingService.MapToInstanceDTO(product.Product.Versions.First(pi => pi.Version == product.Product.LatestVersion)),
                PrevInstance = ProductInstanceMappingService.MapToInstanceDTO(
                    product.Status == Status.Edited ?
                    product.Product.Versions.First(pi => pi.Version == product.Product.LatestVersion - 1) :
                    product.Product.Versions.First(pi => pi.Version == product.Product.LatestVersion))
            };
        }

        public ICollection<UpdateListProductDTO> MapToDTOs(ICollection<ProductToUpdateList> products)
        {
            ArgumentNullException.ThrowIfNull(products);

            return [.. products.Select(p => MapToDTO(p))];
        }

        public ProductToUpdateList MapToModel(int updateListId, string productId, Status status = Status.Pending)
        {
            return new ProductToUpdateList
            {
                ProductId = productId.ToUpper(),
                UpdateListId = updateListId,
                Status = status
            };
        }

        public ICollection<ProductToUpdateList> MapToModels(int updateListId, ICollection<string> productIds, Status status = Status.Pending)
        {
            return [.. productIds.Select(ul => MapToModel(updateListId, ul, status))];
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
