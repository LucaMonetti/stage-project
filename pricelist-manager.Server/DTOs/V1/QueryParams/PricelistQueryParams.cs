namespace pricelist_manager.Server.DTOs.V1.QueryParams
{
    public class PricelistFilterQueryParams : QueryParameters
    {
        public string? CompanyId { get; set; }
    }

    public class PricelistQueryParams : QueryParameters
    {
        public PaginationParameters Pagination { get; set; } = new PaginationParameters();
        public PricelistFilterQueryParams? Filters { get; set; } = new PricelistFilterQueryParams();
    }
}
