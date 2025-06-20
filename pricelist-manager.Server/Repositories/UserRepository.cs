using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.Statistics;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        private readonly UserManager<User> UserManager;

        public UserRepository(DataContext dataContext, UserManager<User> userManage) : base(dataContext) 
        {
            UserManager = userManage;
        }

        public async Task<ICollection<User>> GetAll()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var data = await Context.Users.Include(u => u.Company).ToListAsync();

            return data;

        }

        public async Task<ICollection<User>> GetByCompany(string companyId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var data = await Context.Users.Where(u => u.CompanyId == companyId).Include(u => u.Company).ToListAsync();

            return data;
        }

        public async Task<UserStatistics> GetStatistics()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var companyCount = await Context.Users.CountAsync();
            var adminList = await UserManager.GetUsersInRoleAsync(Roles.ADMIN);
            var userList = await UserManager.GetUsersInRoleAsync(Roles.USER);

            var res = new UserStatistics
            {
                TotalRegistered = companyCount,
                AdminCount = adminList.Count,
                UserCount = userList.Count,
            };

            return res;
        }
    }
}
