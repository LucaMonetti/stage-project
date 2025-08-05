namespace pricelist_manager.Server.DTOs.V1.QueryParams
{

    public class ProductFiltersQueryParams : QueryParameters
    {
        public string? ProductCode { get; set; }
        public string? CompanyId { get; set; }
        public Guid? PricelistId { get; set; }
    }


    public class ProductQueryParams : QueryParameters
    {
        public PaginationParams Pagination { get; set; } = new PaginationParams();
        public ProductFiltersQueryParams? Filters { get; set; } = new ProductFiltersQueryParams();
    }
}
