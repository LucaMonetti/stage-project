using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductMappingService
    {
        ProductDTO MapToDTO(Product product);
        Product MapToProduct(CreateProductDTO createProductDTO);

        ICollection<ProductDTO> MapToDTOs(ICollection<Product> products);
    }
}
