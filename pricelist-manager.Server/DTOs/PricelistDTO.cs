using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace pricelist_manager.Server.DTOs
{
    public class PricelistDTO
    {
        public Guid Id { get; set; }

        [Length(5, 50)]
        public string Name { get; set; } = String.Empty;

        [Length(0, 200)]
        public string Description { get; set; } = String.Empty;

        public Company? Company { get; set; } = null!;

        public ICollection<ProductDTO> Products { get; set; } = [];

        public static PricelistDTO FromPricelist(Pricelist pricelist, ICollection<Product> products)
        {
            return new PricelistDTO
            {
                Id = pricelist.Id,
                Name = pricelist.Name,
                Description = pricelist.Description,
                Company = pricelist.Company,
                Products = ProductDTO.FromProducts(products, pricelist.CompanyId)
            };
        }

        public static ICollection<PricelistDTO> FromPricelists(ICollection<Pricelist> pricelists, ICollection<IGrouping<Guid, Product>> products)
        {
            ICollection<PricelistDTO> pricelist = [];

            for (int i = 0; i < pricelists.Count; i++) 
            {
                pricelist.Add(FromPricelist(pricelists.ElementAt(i), [.. products.ElementAt(i)]));
            }

            return pricelist;
        }
    }
}