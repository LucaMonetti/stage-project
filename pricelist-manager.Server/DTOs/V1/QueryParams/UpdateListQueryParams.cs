using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.DTOs.V1.QueryParams
{

    public class UpdateListQueryParams : QueryParameters
    {
        public PaginationParameters Pagination { get; set; } = new PaginationParameters();
        public Status? status { get; set; }
    }


}
