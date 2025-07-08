using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface ICompanyRepository
    {
        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<PagedList<Company>> GetAllAsync();

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Company doesn't exists.</exception>
        Task<Company> GetByIdAsync(string id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="AlreadyExistsException">The Company already exists.</exception>
        Task<Boolean> CreateAsync(Company entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Company doesn't exists.</exception>
        Task<Boolean> UpdateAsync(Company entity);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        /// <exception cref="NotFoundException">The Company doesn't exists.</exception>
        Task<Boolean> DeleteAsync(string id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<Boolean> ExistsIdAsync(string id);

        /// <exception cref="StorageUnavailableException">The database is not available</exception>
        Task<CompanyStatistics> GetStatistics();
    }
}
