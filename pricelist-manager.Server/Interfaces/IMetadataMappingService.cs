using pricelist_manager.Server.Helpers;

namespace pricelist_manager.Server.Interfaces
{
    public interface IMetadataMappingService<T>
    {
        Metadata MapToMetadata(PagedList<T> paged);
    }
}
