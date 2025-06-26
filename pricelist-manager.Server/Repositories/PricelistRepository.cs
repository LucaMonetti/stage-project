using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.ComponentModel.Design;

namespace pricelist_manager.Server.Repositories
{
    public class PricelistRepository : BaseRepository, IPricelistRepository
    {
        public PricelistRepository(DataContext dataContext) : base(dataContext) { }

        public async Task<bool> CreateAsync(Pricelist entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (await existsIdAsync(entity.Id)) throw new AlreadyExistException<Pricelist>(entity.Id);

            await Context.Pricelists.AddAsync(entity);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var pricelist = await Context.Pricelists.FirstOrDefaultAsync(x => x.Id == id);

            if (pricelist == null) throw new NotFoundException<Pricelist>(id);

            Context.Pricelists.Remove(pricelist);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        public Task<bool> ExistsIdAsync(Guid id)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            return existsIdAsync(id);
        }

        private async Task<Boolean> existsIdAsync(Guid id)
        {
            return await Context.Pricelists.AnyAsync(x => x.Id == id);
        }

        public async Task<ICollection<Pricelist>> GetAllAsync()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var pricelists = await Context.Pricelists.ToListAsync();

            return pricelists;
        }

        public async Task<ICollection<Pricelist>> GetByCompanyAsync(string companyId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var pricelists = await Context.Pricelists.Where(p => p.CompanyId == companyId).Include(p => p.Company).ToListAsync();

            return pricelists;
        }

        public async Task<Pricelist> GetByIdAsync(Guid id)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var pricelist = await Context.Pricelists.Include(p => p.Company).FirstOrDefaultAsync(p => p.Id == id);

            if (pricelist == null) throw new NotFoundException<Pricelist>(id);

            return pricelist;
        }

        public async Task<bool> UpdateAsync(Pricelist entity)
        {
            if(!CanConnect()) throw new StorageUnavailableException();

            if (!(await existsIdAsync(entity.Id))) throw new NotFoundException<Pricelist>(entity.Id);

            Context.Pricelists.Update(entity);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        public async Task<PricelistStatistics> GetStatistics()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var companyCount = await Context.Pricelists.CountAsync();

            var res = new PricelistStatistics
            {
                TotalRegistered = companyCount,
            };

            return res;
        }
    }
}
