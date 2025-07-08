namespace pricelist_manager.Server.DTOs.V1.QueryParams
{

    public class ProductQueryParams : QueryParameters
    {
        public PaginationParameters Pagination { get; set; } = new PaginationParameters();
    }
}
