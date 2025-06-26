using pricelist_manager.Server.Models;
namespace pricelist_manager.Server.DTOs
{
    public class ProductInstanceDTO
    {
        public string ProductId = "";
        public int Version { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; } = Decimal.Zero;
        public Decimal Cost { get; set; } = Decimal.Zero;
        public string AccountingControl { get; set; } = String.Empty;
        public string CDA { get; set; } = String.Empty;
        public string SalesItem { get; set; } = String.Empty;

        public static ProductInstanceDTO FromProductInstance(ProductInstance? productInstance)
        {
            return productInstance != null ? new ProductInstanceDTO
            {
                ProductId = productInstance.ProductId,
                Version = productInstance.Version,
                Name = productInstance.Name,
                Description = productInstance.Description,
                Price = productInstance.Price,
                Cost = productInstance.Cost,
                AccountingControl = productInstance.AccountingControl,
                CDA = productInstance.CDA,
                SalesItem = productInstance.SalesItem
            } : new ProductInstanceDTO();
        }

        public static ICollection<ProductInstanceDTO> FromProductInstances(ICollection<ProductInstance> productInstance)
        {
            ICollection<ProductInstanceDTO> products = [];

            foreach (ProductInstance? product in productInstance)
            {
                products.Add(FromProductInstance(product));
            }

            return products;
        }

        public static ProductInstance ToProductInstance(ProductInstanceDTO productInstance, Guid pricelistId, string productCode)
        {
            return new ProductInstance
            {
                ProductId = productInstance.ProductId,
                Version = productInstance.Version,
                Name = productInstance.Name,
                Description = productInstance.Description,
                Price = productInstance.Price,
                AccountingControl= productInstance.AccountingControl,
                CDA = productInstance.CDA,
                SalesItem = productInstance.SalesItem,
                Cost = productInstance.Cost
            };
        }
    }
}
