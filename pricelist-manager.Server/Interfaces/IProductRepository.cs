using pricelist_manager.Server.DTOs.Statistics;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductRepository
    {
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<ICollection<Product>> GetAllAsync(Guid pricelistId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<ICollection<IGrouping<Guid, Product>>> GetAllGroupPricelistAsync();

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Product> GetByIdAsync(Guid pricelistId, string productCode);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<ICollection<Product>> GetByNameAsync(string name);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<ICollection<Product>> GetByCodeAsync(string code);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="AlreadyExistsException">The Product already exists.</exception>
        Task<Boolean> CreateAsync(Product entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Boolean> UpdateAsync(Product entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Boolean> DeleteAsync(Guid pricelistId, string productId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<Boolean> ExistsIdAsync(Guid pricelistId, string id);

        Task<ProductStatistics> GetStatistics();
    }
}
