using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.ComponentModel.Design;

namespace pricelist_manager.Server.Repositories
{
    public class PricelistRepository : BaseRepository, IPricelistRepository
    {
        public PricelistRepository(DataContext dataContext) : base(dataContext) { }

        public async Task<Pricelist> CreateAsync(Pricelist entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (await existsIdAsync(entity.Id)) throw new AlreadyExistException<Pricelist>(entity.Id);

            await Context.Pricelists.AddAsync(entity);
            await Context.SaveChangesAsync();

            return await GetByIdAsync(entity.Id);
        }

        public async Task<Pricelist> DeleteAsync(Guid id)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var pricelist = await Context.Pricelists.FirstOrDefaultAsync(x => x.Id == id);

            if (pricelist == null) throw new NotFoundException<Pricelist>(id);

            Context.Pricelists.Remove(pricelist);
            await Context.SaveChangesAsync();

            return pricelist;
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

        public async Task<PagedList<Pricelist>> GetAllAsync(PricelistQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Pricelists.Include(p => p.Products).ThenInclude(p => p.Versions).ThenInclude(v => v.UpdatedBy).Include(p => p.Company);

            return await PagedList<Pricelist>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<PagedList<Pricelist>> GetByCompanyAsync(string companyId, PricelistQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Pricelists.Where(p => p.CompanyId == companyId).Include(p => p.Products).ThenInclude(p => p.Versions).ThenInclude(v => v.UpdatedBy).Include(p => p.Company);

            return await PagedList<Pricelist>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<Pricelist> GetByIdAsync(Guid id)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var pricelist = await Context.Pricelists.Include(p => p.Products).ThenInclude(p => p.Versions).ThenInclude(v => v.UpdatedBy).Include(p => p.Company).FirstOrDefaultAsync(p => p.Id == id);

            if (pricelist == null) throw new NotFoundException<Pricelist>(id);

            return pricelist;
        }

        public async Task<Pricelist> UpdateAsync(Pricelist entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (!(await existsIdAsync(entity.Id))) throw new NotFoundException<Pricelist>(entity.Id);

            Context.Pricelists.Update(entity);
            await Context.SaveChangesAsync();

            return entity;
        }

        public async Task<PricelistStatistics> GetStatistics(string? companyId = null)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            int companyCount;

            if (companyId != null)
            {
                companyCount = await Context.Pricelists.CountAsync(p => p.CompanyId == companyId);
            }
            else
            {
                companyCount = await Context.Pricelists.CountAsync();
            }

            var res = new PricelistStatistics
            {
                TotalRegistered = companyCount,
            };

            return res;
        }
    }
}
