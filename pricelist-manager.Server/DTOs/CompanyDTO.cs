using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;

namespace pricelist_manager.Server.DTOs
{
    public class CompanyDTO
    {
        [Length(1, 10)]
        public required string Id { get; set; }

        [Length(2, 100)]
        public string Name { get; set; } = string.Empty;

        [Length(2, 100)]
        public string Address { get; set; } = string.Empty;

        [StringLength(5, MinimumLength = 5, ErrorMessage = "Must have 5 digits.")]
        public string PostalCode { get; set; } = string.Empty;

        [Length(2, 10)]
        public string Province { get; set; } = string.Empty;

        [Length(2, 30)]
        public string Phone { get; set; } = string.Empty;

        [Length(2, 200)]
        public string LogoUri { get; set; } = string.Empty;

        [Length(7, 7)]
        public string InterfaceColor { get; set; } = string.Empty;

        public ICollection<ProductDTO>? Products { get; set; } = null!;
        public ICollection<PricelistDTO>? Pricelists { get; set; } = null!;


        public static CompanyDTO FromCompany(Company company, ICollection<ProductDTO>? products = null!, ICollection<PricelistDTO>? pricelists = null!)
        {
            return new CompanyDTO
            {
                Id = company.Id,
                Name = company.Name,
                Address = company.Address,
                InterfaceColor = company.InterfaceColor,
                LogoUri = company.LogoUri,
                Phone = company.Phone,
                PostalCode = company.PostalCode,
                Province = company.Province,
                Pricelists = pricelists,
                Products = products
            };
        }

        public static ICollection<CompanyDTO> FromCompanies(ICollection<(Company company, ICollection<ProductDTO>? products, ICollection<PricelistDTO>? pricelists)> elements)
        {
            ICollection<CompanyDTO> data = [];

            foreach (var element in elements)
            {
                data.Add(FromCompany(element.company, element.products, element.pricelists));
            }

            return data;
        }
    }

}
