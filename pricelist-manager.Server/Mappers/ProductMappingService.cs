using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System;

namespace pricelist_manager.Server.Mappers
{
    public class ProductMappingService : IProductMappingService
    {
        private readonly IProductInstanceMappingService ProductInstanceMapping;
        private readonly IPricelistLiteMappingService PricelistMapping;
        private readonly ICompanyLiteMappingService CompanyMapping;

        public ProductMappingService(IProductInstanceMappingService productInstanceMapping, IPricelistLiteMappingService pricelistLiteMappingService, ICompanyLiteMappingService companyLiteMapping)
        {
            ProductInstanceMapping = productInstanceMapping;
            PricelistMapping = pricelistLiteMappingService;
            CompanyMapping = companyLiteMapping;
        }

        public ProductDTO MapToDTO(Product product)
        {
            ArgumentNullException.ThrowIfNull(product);

            if (product.Versions.Count == 0)
                throw new InvalidOperationException("Product must have at least one version");

            var currentInstance = GetCurrentInstance(product);

            return new ProductDTO
            {
                PricelistId = product.PricelistId,
                ProductCode = product.ProductCode,
                LatestVersion = product.LatestVersion,
                CurrentInstance = ProductInstanceMapping.MapToInstanceDTO(currentInstance),
                CompanyId = product.CompanyId,
                TotalVersions = product.Versions.Count,
                Id = product.Id,
                Pricelist = PricelistMapping.MapToLiteDTO(product.Pricelist),
                Company = CompanyMapping.MapToLiteDTO(product.Company),
                Versions = ProductInstanceMapping.MapToInstanceDTOs(product.Versions)
            };
        }

        public ICollection<ProductDTO> MapToDTOs(ICollection<Product> products)
        {
            ArgumentNullException.ThrowIfNull(products);

            return [.. products.Select(p => MapToDTO(p))];
        }

        private static ProductInstance GetCurrentInstance(Product product)
        {
            // More robust way to get current instance
            return product.Versions
                .Where(v => v.Version == product.LatestVersion)
                .FirstOrDefault() ?? product.Versions.OrderByDescending(v => v.Version).First();
        }

        public Product MapToProduct(CreateProductDTO dto, string companyId)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new Product
            {
                Id = $"{companyId}-{dto.ProductCode}",
                PricelistId = dto.PricelistId,
                ProductCode = dto.ProductCode,
                CompanyId = companyId,
                LatestVersion = 0,
                Versions = [ProductInstanceMapping.MapToProductInstance(dto, companyId)]
            };
        }
    }
}
