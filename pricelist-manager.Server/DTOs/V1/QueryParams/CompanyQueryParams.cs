namespace pricelist_manager.Server.DTOs.V1.QueryParams
{
    public class CompanyQueryParams : QueryParameters
    {
        public PaginationParameters Pagination { get; set; } = new PaginationParameters();
    }
}
