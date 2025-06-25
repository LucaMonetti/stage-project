using pricelist_manager.Server.DTOs.Statistics;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductRepository: IBaseRepository
    {
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<ICollection<Product>> GetAllProductsWithPricelistsAsync();

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<ICollection<Product>> GetAllAsync(Guid pricelistId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<ICollection<IGrouping<Guid, Product>>> GetAllGroupPricelistAsync();

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Product> GetByIdAsync(string productId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<ICollection<Product>> GetByNameAsync(string name);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<ICollection<Product>> GetByCodeAsync(string code);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<ICollection<Product>> GetByCompany(string company);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="AlreadyExistsException">The Product already exists.</exception>
        Task<Boolean> CreateAsync(Product entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Boolean> UpdateAsync(Product entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Boolean> DeleteAsync(string productId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<Boolean> ExistsIdAsync(string productId);

        Task<ProductStatistics> GetStatistics();
    }
}
