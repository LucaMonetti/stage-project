using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductMappingService
    {
        ProductDTO MapToDTO(Product product);
        Product MapToProduct(CreateProductDTO createProductDTO, string companyId, string userId);
        Product MapToProduct(ProductCsvDTO csvDto, Pricelist pricelist, string userId);

        PagedList<ProductDTO> MapToDTOs(PagedList<Product> products);
        public ICollection<Product> MapToProducts(ICollection<ProductCsvDTO> products, Pricelist pricelist, string userId);
    }
}
