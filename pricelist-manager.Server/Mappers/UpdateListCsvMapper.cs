
using CsvHelper.Configuration;
using pricelist_manager.Server.DTOs.V1;

namespace pricelist_manager.Server.Mappers
{
    public class UpdateListCsvMapper : ClassMap<UpdateListCsvDTO>
    {
        public UpdateListCsvMapper()
        {
            Map(m => m.ProductId).Name("ProductId");
            Map(m => m.Name).Name("ProductName");
            Map(m => m.Description).Name("ProductDescription");
            Map(m => m.Price).Name("ProductPrice");
            Map(m => m.Cost).Name("ProductCost");
            Map(m => m.Margin).Name("ProductMargin");
            Map(m => m.AccountingControl).Name("ProductAccountingControl");
            Map(m => m.CDA).Name("ProductCDA");
            Map(m => m.SalesItem).Name("ProductSalesItem");
        }
    }
}