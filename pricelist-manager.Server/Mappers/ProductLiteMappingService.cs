using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System;

namespace pricelist_manager.Server.Mappers
{
    public class ProductLiteMappingService : IProductLiteMappingService
    {
        private readonly IProductInstanceMappingService productInstanceMapping;

        public ProductLiteMappingService(IProductInstanceMappingService productInstanceMapping)
        {
            this.productInstanceMapping = productInstanceMapping;
        }

        public ProductLiteDTO MapToLiteDTO(Product product)
        {
            ArgumentNullException.ThrowIfNull(product);

            if (product.Versions?.Any() != true)
                throw new InvalidOperationException("Product must have at least one version");

            var currentInstance = GetCurrentInstance(product);

            return new ProductLiteDTO
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                LatestVersion = product.LatestVersion,
                CurrentInstance = productInstanceMapping.MapToInstanceDTO(currentInstance),
                CompanyId = product.CompanyId,
                TotalVersions = product.Versions.Count,
                Id = product.Id
            };
        }

        public ICollection<ProductLiteDTO> MapToLiteDTOs(ICollection<Product> products)
        {
            ArgumentNullException.ThrowIfNull(products);

            return [.. products.Select(p => MapToLiteDTO(p))];
        }

        private static ProductInstance GetCurrentInstance(Product product)
        {
            // More robust way to get current instance
            return product.Versions
                .Where(v => v.Version == product.LatestVersion)
                .FirstOrDefault() ?? product.Versions.OrderByDescending(v => v.Version).First();
        }

    }
}
