using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IProductRepository: IBaseRepository
    {
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PagedList<Product>> GetAllAsync(ProductQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PagedList<Product>> GetByPricelistAsync(Guid pricelistId, ProductQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PagedList<IGrouping<Guid, Product>>> GetAllGroupPricelistAsync(ProductQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Product> GetByIdAsync(string productId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<ICollection<Product>> GetByIdsAsync(ICollection<string> productIds);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<PagedList<Product>> GetByNameAsync(string name, ProductQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<PagedList<Product>> GetByCodeAsync(string code, ProductQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<PagedList<Product>> GetByCompany(string company, ProductQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="AlreadyExistsException">The Product already exists.</exception>
        Task<Product> CreateAsync(Product entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Product> UpdateAsync(Product entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Product doesn't exists.</exception>
        Task<Product> DeleteAsync(string productId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<Boolean> ExistsIdAsync(string productId);

        Task<ProductStatistics> GetStatistics();
    }
}
