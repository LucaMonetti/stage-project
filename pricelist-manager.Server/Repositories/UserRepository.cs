using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.DTOs.V1.Statistics;
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

        public async Task<ICollection<(User user, ICollection<string> roles)>> GetAll()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var users = await Context.Users.Include(u => u.Company).ToListAsync();
            var data = new List<(User user, ICollection<string> roles)>();

            foreach (var user in users)
            {
                var userRoles = await UserManager.GetRolesAsync(user);
                data.Add((user, userRoles));
            }

            return data;
        }

        public async Task<ICollection<(User user, ICollection<string> roles)>> GetByCompany(string companyId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var users = await Context.Users.Where(u => u.CompanyId == companyId).Include(u => u.Company).ToListAsync();

            var data = new List<(User user, ICollection<string> roles)>();

            foreach (var user in users)
            {
                var userRoles = await UserManager.GetRolesAsync(user);
                data.Add((user, userRoles));
            }

            return data;
        }

        public async Task<(User user, ICollection<string> roles)> GetById(string userId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var data = await Context.Users.Include(u => u.Company).FirstOrDefaultAsync(u => u.Id == userId);

            if (data == null) 
                throw new NotFoundException<User>(userId);

            var userRoles = await UserManager.GetRolesAsync(data);

            return (data, userRoles);
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

        public async Task<User> UpdateAsync(User user)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var item = Context.Users.Update(user);
            await Context.SaveChangesAsync();

            return item.Entity;
        }
    }
}
