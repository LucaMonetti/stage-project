using pricelist_manager.Server.Models;
namespace pricelist_manager.Server.DTOs.V1
{
    public class ProductInstanceDTO
    {
        public string ProductId = "";
        public int Version { get; set; } = 0;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; } = decimal.Zero;
        public decimal Cost { get; set; } = decimal.Zero;
        public decimal Margin { get; set; } = 1.0M;
        public string AccountingControl { get; set; } = string.Empty;
        public string CDA { get; set; } = string.Empty;
        public string SalesItem { get; set; } = string.Empty;

        public DateTime UpdatedAt {  get; set; } = DateTime.Now;
    }
}
