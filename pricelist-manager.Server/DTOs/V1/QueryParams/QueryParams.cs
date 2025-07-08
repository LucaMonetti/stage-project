namespace pricelist_manager.Server.DTOs.V1.QueryParams
{
    public abstract class QueryParameters
    {
    }

    public class PaginationParameters : QueryParameters
    {
        private const int MaxPageSize = 50;
        private int _pageSize = 10;

        public int PageNumber { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public int Skip => (PageNumber - 1) * PageSize;
        public int Take => PageSize;
    }
    public static partial class QueryableExtensions
    {
        public static IQueryable<T> ApplyPagination<T>(this IQueryable<T> source, PaginationParameters pagination)
        {
            if (pagination == null)
            {
                return source;
            }
            return source.Skip(pagination.Skip).Take(pagination.Take);
        }
    }
}
