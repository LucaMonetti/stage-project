using pricelist_manager.Server.Models;
namespace pricelist_manager.Server.DTOs
{
    public class ProductInstanceDTO
    {
        public int Version { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; } = Decimal.Zero;

        public static ProductInstanceDTO FromProductInstance(ProductInstanceDTO? productInstance)
        {
            return productInstance != null ? new ProductInstanceDTO
            {
                Version = productInstance.Version,
                Name = productInstance.Name,
                Description = productInstance.Description,
                Price = productInstance.Price
            } : new ProductInstanceDTO();
        }

        public static ProductInstance ToProductInstance(ProductInstanceDTO productInstance, Guid pricelistId, string productCode)
        {
            return new ProductInstance
            {
                PricelistId = pricelistId,
                Id = productCode,
                Version = productInstance.Version,
                Name = productInstance.Name,
                Description = productInstance.Description,
                Price = productInstance.Price
            };
        }
    }
}
