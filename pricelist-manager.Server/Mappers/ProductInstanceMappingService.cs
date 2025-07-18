using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System;

namespace pricelist_manager.Server.Mappers
{
    public class ProductInstanceMappingService : IProductInstanceMappingService
    {
        private readonly IUserLiteMappingService UserLiteMappingService;

        public ProductInstanceMappingService(IUserLiteMappingService userLiteMappingService)
        {
            UserLiteMappingService = userLiteMappingService;
        }

        public ProductInstance MapToProductInstance(CreateProductDTO dto, string companyId, string userId)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new ProductInstance
            {
                ProductId = $"{companyId.ToUpper()}-{dto.ProductCode.ToUpper()}",
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Cost = dto.Cost,
                Version = 0,
                AccountingControl = dto.AccountingControl,
                CDA = dto.CDA,
                SalesItem = dto.SalesItem,
                Margin = dto.Margin,
                UserId = userId,
            };
        }

        public ProductInstance MapToProductInstance(UpdateProductDTO dto, int version, string userId)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new ProductInstance
            {
                ProductId = dto.ProductId.ToUpper(),
                Description = dto.Description,
                Name = dto.Name,
                Price = dto.Price,
                Version = version,
                CDA = dto.CDA,
                Cost = dto.Cost,
                AccountingControl = dto.AccountingControl,
                SalesItem = dto.SalesItem,
                Margin = dto.Margin,
                UserId = userId
            };
        }

        public ProductInstance MapToProductInstance(ProductInstanceDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new ProductInstance
            {
                ProductId = dto.ProductId.ToUpper(),
                Version = dto.Version,
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                AccountingControl = dto.AccountingControl,
                CDA = dto.CDA,
                SalesItem = dto.SalesItem,
                Cost = dto.Cost,
                UpdatedAt = dto.UpdatedAt,
                Margin = dto.Margin,
                UserId = dto.UpdatedBy.Id
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
                Margin = product.Margin,
                UpdatedBy = UserLiteMappingService.MapToLiteDTO(product.UpdatedBy ?? throw new ArgumentNullException(nameof(product.UpdatedBy)))
            };
        }

        public ICollection<ProductInstanceDTO> MapToInstanceDTOs(ICollection<ProductInstance> products)
        {
            ArgumentNullException.ThrowIfNull(products);

            return [.. products.Select(p => MapToInstanceDTO(p))];
        }

        public ProductInstance MapToProductInstance(ProductCsvDTO csvDto, Pricelist pricelist, string userId)
        {
            ArgumentNullException.ThrowIfNull(csvDto);
            ArgumentNullException.ThrowIfNull(pricelist);

            return new ProductInstance
            {
                ProductId = $"{pricelist.CompanyId.ToUpper()}-{csvDto.ProductCode.ToUpper()}",
                Name = csvDto.Name,
                Description = csvDto.Description,
                Price = csvDto.Price,
                Cost = csvDto.Cost,
                Version = 0,
                AccountingControl = csvDto.AccountingControl,
                CDA = csvDto.CDA,
                SalesItem = csvDto.SalesItem,
                Margin = csvDto.Margin,
                UserId = userId
            };
        }
    }
}
