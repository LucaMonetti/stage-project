using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductInstanceMappingService
    {
        ProductInstanceDTO MapToInstanceDTO(ProductInstance product);

        public ProductInstance MapToProductInstance(CreateProductDTO dto);
        public ProductInstance MapToProductInstance(UpdateProductDTO dto, int version);
        public ProductInstance MapToProductInstance(ProductInstanceDTO dto);

        ICollection<ProductInstanceDTO> MapToInstanceDTOs(ICollection<ProductInstance> products);
    }
}
