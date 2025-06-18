using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(DataContext dataContext) : base(dataContext) { }

        public async Task<ICollection<User>> GetAll()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var data = await Context.Users.ToListAsync();

            return data;

        }

        public async Task<ICollection<User>> GetByCompany(string companyId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var data = await Context.Users.Where(u => u.CompanyId == companyId).ToListAsync();

            return data;
        }
    }
}
