using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductInstanceMappingService
    {
        ProductInstanceDTO MapToInstanceDTO(ProductInstance product);

        ProductInstance MapToProductInstance(CreateProductDTO dto, string companyId, string userId);
        ProductInstance MapToProductInstance(UpdateProductDTO dto, int version, string userId);
        ProductInstance MapToProductInstance(UpdateListCsvDTO dto, ProductInstance previousInstance, string userId);
        ProductInstance MapToProductInstance(ProductCsvDTO dto, Pricelist pricelist, string userId);
        ProductInstance MapToProductInstance(ProductInstanceDTO dto);

        ICollection<ProductInstanceDTO> MapToInstanceDTOs(ICollection<ProductInstance> products);
        ICollection<ProductInstance> MapToProductInstances(ICollection<(UpdateListCsvDTO dto, ProductInstance previousInstance)> products, string userId);
    }
}
