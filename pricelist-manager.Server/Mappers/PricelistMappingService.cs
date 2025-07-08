using Microsoft.VisualBasic;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Mappers
{
    public class PricelistMappingService : IPricelistMappingService
    {
        private readonly IProductLiteMappingService ProductMapping;
        private readonly ICompanyLiteMappingService CompanyMapping;

        public PricelistMappingService(IProductLiteMappingService productMappingService, ICompanyLiteMappingService companyMappingService)
        {
            ProductMapping = productMappingService;
            CompanyMapping = companyMappingService;
        }

        public PricelistDTO MapToDTO(Pricelist pricelist)
        {
            ArgumentNullException.ThrowIfNull(pricelist);

            return new PricelistDTO
            {
                Id = pricelist.Id,
                Name = pricelist.Name,
                Description = pricelist.Description,
                Company = CompanyMapping.MapToLiteDTO(pricelist.Company),
                Products = ProductMapping.MapToLiteDTOs(pricelist.Products)
            };
        }

        public PagedList<PricelistDTO> MapToDTOs(PagedList<Pricelist> pricelists)
        {
            ArgumentNullException.ThrowIfNull(pricelists);

            return new PagedList<PricelistDTO>([.. pricelists.Select(p => MapToDTO(p))], pricelists.TotalCount, pricelists.CurrentPage, pricelists.PageSize);
        }

        public Pricelist MapToPricelist(CreatePricelistDTO pricelist)
        {
            ArgumentNullException.ThrowIfNull(pricelist);

            return new Pricelist
            {
                Id = pricelist.Id,
                Name = pricelist.Name,
                Description = pricelist.Description,
                CompanyId = pricelist.CompanyId
            };
        }

        public Pricelist MapToPricelist(UpdatePricelistDTO pricelist)
        {
            ArgumentNullException.ThrowIfNull(pricelist);

            return new Pricelist
            {
                Id = pricelist.Id,
                Name = pricelist.Name,
                Description = pricelist.Description,
                CompanyId = pricelist.CompanyId
            };
        }
    }
}
