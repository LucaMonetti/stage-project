using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace pricelist_manager.Server.DTOs
{
    public class PricelistNoProdsDTO
    {
        public Guid Id { get; set; }

        [Length(5, 50)]
        public string Name { get; set; } = String.Empty;

        [Length(0, 200)]
        public string Description { get; set; } = String.Empty;

        public Company? Company { get; set; } = null!;

        public static PricelistNoProdsDTO FromPricelist(Pricelist pricelist)
        {
            return new PricelistNoProdsDTO
            {
                Id = pricelist.Id,
                Name = pricelist.Name,
                Description = pricelist.Description,
                Company = pricelist.Company,
            };
        }

        public static ICollection<PricelistNoProdsDTO> FromPricelists(ICollection<Pricelist> pricelistCollection)
        {
            ICollection<PricelistNoProdsDTO> pricelists = [];

            foreach (var pricelist in pricelistCollection)
            {
                pricelists.Add(FromPricelist(pricelist));
            }

            return pricelists;
        }
    }

    public class PricelistDTO : PricelistNoProdsDTO
    {
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

        public static ICollection<PricelistDTO> FromPricelists(ICollection<Pricelist> pricelistCollection, ICollection<IGrouping<Guid, Product>> products)
        {
            ICollection<PricelistDTO> pricelists = [];

            for (int i = 0; i < pricelistCollection.Count; i++) 
            {
                pricelists.Add(FromPricelist(pricelistCollection.ElementAt(i), [.. products.ElementAt(i)]));
            }

            return pricelists;
        }
    }
}