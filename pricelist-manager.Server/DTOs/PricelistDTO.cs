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

        public ICollection<ProductDTO>? Products { get; set; } = null!;

        public static PricelistDTO FromPricelist(Pricelist pricelist, ICollection<Product>? products = null!)
        {
            return new PricelistDTO
            {
                Id = pricelist.Id,
                Name = pricelist.Name,
                Description = pricelist.Description,
                Company = pricelist.Company,
                Products = ProductDTO.FromProducts(products ?? [])
            };
        }

        public static ICollection<PricelistDTO> FromPricelists(ICollection<Pricelist> pricelistCollection, ICollection<IGrouping<Guid, Product>> productsByPricelistId)
        {
            ICollection<PricelistDTO> pricelists = [];

            for (int i = 0; i < pricelistCollection.Count; i++)
            {
                if (productsByPricelistId.ElementAtOrDefault(i) != null)
                    pricelists.Add(FromPricelist(pricelistCollection.ElementAt(i), [.. productsByPricelistId.ElementAtOrDefault(i)]));
                else
                    pricelists.Add(FromPricelist(pricelistCollection.ElementAt(i)));
            }

            return pricelists;
        }
    }
}