using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductLiteMappingService
    {
        ProductLiteDTO MapToLiteDTO(Product product);

        ICollection<ProductLiteDTO> MapToLiteDTOs(ICollection<Product> products);
    }
}
