namespace pricelist_manager.Server.DTOs.V1.QueryParams
{
    public class CompanyQueryParams : QueryParameters
    {
        public PaginationParams Pagination { get; set; } = new PaginationParams();
    }
}
