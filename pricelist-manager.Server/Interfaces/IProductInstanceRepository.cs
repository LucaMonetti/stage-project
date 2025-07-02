using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductInstanceRepository
    {
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The ProductInstance doesn't exists.</exception>
        public Task<ICollection<ProductInstance>> GetAllAsync(string productId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The ProductInstance doesn't exists.</exception>
        public Task<ProductInstance> GetByVersionAsync(string productId, int version);
        
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="AlreadyExistsException">The Company already exists.</exception>
        public Task<Boolean> CreateAsync(ProductInstance productInstance);
    }
}
