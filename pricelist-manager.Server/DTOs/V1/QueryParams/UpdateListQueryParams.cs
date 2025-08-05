using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.DTOs.V1.QueryParams
{

    public class UpdatelistFiltersQueryParams : QueryParameters
    {
        public string? Name { get; set; }
        public string? CompanyId { get; set; }
        public int? Status { get; set; }
    }

    public class UpdateListQueryParams : QueryParameters
    {
        public PaginationParams Pagination { get; set; } = new PaginationParams();
        public UpdatelistFiltersQueryParams Filters { get; set; } = new UpdatelistFiltersQueryParams();
    }
}
