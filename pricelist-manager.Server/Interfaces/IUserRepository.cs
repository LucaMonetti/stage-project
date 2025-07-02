using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUserRepository : IBaseRepository
    {
        Task<ICollection<(User user, ICollection<string> roles)>> GetAll();
        Task<(User user, ICollection<string> roles)> GetById(string userId);
        Task<ICollection<(User user, ICollection<string> roles)>> GetByCompany(string companyId);

        Task<UserStatistics> GetStatistics();
    }
}
