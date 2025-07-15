namespace pricelist_manager.Server.DTOs.V1.QueryParams
{

    public class ProductFiltersQueryParams : QueryParameters
    {
        public string? ProductCode { get; set; }
        public string? CompanyId { get; set; }
    }


    public class ProductQueryParams : QueryParameters
    {
        public PaginationParameters Pagination { get; set; } = new PaginationParameters();
        public ProductFiltersQueryParams? Filters { get; set; } = new ProductFiltersQueryParams();
    }
}
