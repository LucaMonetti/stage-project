using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System;

namespace pricelist_manager.Server.Mappers
{
    public class ProductInstanceMappingService : IProductInstanceMappingService
    {
        public ProductInstance MapToProductInstance(CreateProductDTO dto, string companyId)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new ProductInstance
            {
                ProductId = $"{companyId}-{dto.ProductCode}",
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Cost = dto.Cost,
                Version = 0,
                AccountingControl = dto.AccountingControl,
                CDA = dto.CDA,
                SalesItem = dto.SalesItem,
            };
        }

        public ProductInstance MapToProductInstance(UpdateProductDTO dto, int version)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new ProductInstance
            {
                ProductId = dto.ProductId,
                Description = dto.Description,
                Name = dto.Name,
                Price = dto.Price,
                Version = version,
                CDA = dto.CDA,
                Cost = dto.Cost,
                AccountingControl = dto.AccountingControl,
                SalesItem = dto.SalesItem
            };
        }

        public ProductInstance MapToProductInstance(ProductInstanceDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new ProductInstance
            {
                ProductId = dto.ProductId,
                Version = dto.Version,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                AccountingControl = dto.AccountingControl,
                CDA = dto.CDA,
                SalesItem = dto.SalesItem,
                Cost = dto.Cost,
                UpdatedAt = dto.UpdatedAt
            };
        }

        public ProductInstanceDTO MapToInstanceDTO(ProductInstance product)
        {
            ArgumentNullException.ThrowIfNull(product);

            return new ProductInstanceDTO
            {
                ProductId = product.ProductId,
                Version = product.Version,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Cost = product.Cost,
                AccountingControl = product.AccountingControl,
                CDA = product.CDA,
                SalesItem = product.SalesItem,
                UpdatedAt = product.UpdatedAt,
            };
        }

        public ICollection<ProductInstanceDTO> MapToInstanceDTOs(ICollection<ProductInstance> products)
        {
            ArgumentNullException.ThrowIfNull(products);

            return [.. products.Select(p => MapToInstanceDTO(p))];
        }
    }
}
