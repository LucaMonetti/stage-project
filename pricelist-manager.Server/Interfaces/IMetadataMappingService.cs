using pricelist_manager.Server.Helpers;

namespace pricelist_manager.Server.Interfaces
{
    public interface IMetadataMappingService
    {
        Metadata MapToMetadata(IPagedList paged);
    }
}
