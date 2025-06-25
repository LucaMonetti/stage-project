using pricelist_manager.Server.DTOs.Statistics;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IPricelistRepository: IBaseRepository
    {
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<ICollection<Pricelist>> GetAllAsync();

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<ICollection<Pricelist>> GetByCompanyAsync(string companyId);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Pricelist doesn't exists.</exception>
        Task<Pricelist> GetByIdAsync(Guid id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="AlreadyExistsException">The Pricelist already exists.</exception>
        Task<Boolean> CreateAsync(Pricelist entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Pricelist doesn't exists.</exception>
        Task<Boolean> UpdateAsync(Pricelist entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Pricelist doesn't exists.</exception>
        Task<Boolean> DeleteAsync(Guid id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<Boolean> ExistsIdAsync(Guid id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PricelistStatistics> GetStatistics();
    }
}
