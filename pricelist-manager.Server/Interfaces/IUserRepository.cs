using pricelist_manager.Server.DTOs.Statistics;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUserRepository : IBaseRepository
    {
        Task<ICollection<User>> GetAll();
        Task<ICollection<User>> GetByCompany(string companyId);

        Task<UserStatistics> GetStatistics();
    }
}
