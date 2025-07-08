using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;

namespace pricelist_manager.Server.Mappers
{
    public class MetadataMappingService<T> : IMetadataMappingService<T>
    {
        public Metadata MapToMetadata(PagedList<T> paged)
        {
            ArgumentNullException.ThrowIfNull(paged);

            return new Metadata
            {
                CurrentPage = paged.Count,
                HasPrevious = paged.HasPrevious,
                HasNext = paged.HasNext,
                PageSize = paged.PageSize,
                TotalCount = paged.TotalCount,
                TotalPages = paged.TotalPages,
            };
        }
    }
}
