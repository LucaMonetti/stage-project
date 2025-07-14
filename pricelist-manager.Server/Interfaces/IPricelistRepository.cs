using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IPricelistRepository : IBaseRepository
    {
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PagedList<Pricelist>> GetAllAsync(PricelistQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PagedList<Pricelist>> GetByCompanyAsync(string companyId, PricelistQueryParams requestParams);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Pricelist doesn't exists.</exception>
        Task<Pricelist> GetByIdAsync(Guid id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="AlreadyExistsException">The Pricelist already exists.</exception>
        Task<Pricelist> CreateAsync(Pricelist entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Pricelist doesn't exists.</exception>
        Task<Pricelist> UpdateAsync(Pricelist entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Pricelist doesn't exists.</exception>
        Task<Pricelist> DeleteAsync(Guid id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<Boolean> ExistsIdAsync(Guid id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PricelistStatistics> GetStatistics(string? companyId = null);
    }
}
