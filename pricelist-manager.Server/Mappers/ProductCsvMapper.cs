
using CsvHelper.Configuration;
using pricelist_manager.Server.DTOs.V1;

namespace pricelist_manager.Server.Mappers
{
    public class ProductCsvRecordMap : ClassMap<ProductCsvDTO>
    {
        public ProductCsvRecordMap()
        {
            Map(m => m.ProductCode).Name("ProductCode");
            Map(m => m.Name).Name("ProductName");
            Map(m => m.Description).Name("ProductDescription");
            Map(m => m.Price).Name("ProductPrice");
            Map(m => m.Cost).Name("ProductCost");
            Map(m => m.Margin).Name("ProductMargin");
            Map(m => m.AccountingControl).Name("AccountingControl");
            Map(m => m.CDA).Name("CDA");
            Map(m => m.SalesItem).Name("SalesItem");
        }
    }
}