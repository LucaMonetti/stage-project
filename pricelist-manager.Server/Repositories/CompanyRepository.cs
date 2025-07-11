using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace pricelist_manager.Server.Repositories
{
    public class CompanyRepository : BaseRepository, ICompanyRepository
    {

        public CompanyRepository(DataContext context) : base(context)
        { }

        public async Task<Company> CreateAsync(Company entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (ExistsId(entity.Id)) throw new AlreadyExistException<Company>(entity.Id);

            await Context.AddAsync(entity);
            await Context.SaveChangesAsync();

            return entity;
        }

        public async Task<Company> DeleteAsync(string id)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var res = await GetByIdAsync(id);

            Context.Remove(res);
            await Context.SaveChangesAsync();

            return res;
        }

        public async Task<bool> ExistsIdAsync(string id)
        {
            return await Context.Companies.AnyAsync(e => e.Id == id);
        }

        public async Task<PagedList<Company>> GetAllAsync(CompanyQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Companies.Include(c => c.Products).ThenInclude(p => p.Versions).Include(c => c.Pricelists);

            return await PagedList<Company>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<Company> GetByIdAsync(string id)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var res = await Context.Companies.Include(c => c.Products).ThenInclude(p => p.Versions).Include(c => c.Pricelists).FirstOrDefaultAsync(x => x.Id == id);

            if (res == null) throw new NotFoundException<Company>(id);

            return res;
        }

        public async Task<CompanyStatistics> GetStatistics()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var companyCount = await Context.Companies.CountAsync();

            var res = new CompanyStatistics
            {
                TotalRegistered = companyCount,
            };

            return res;
        }

        public async Task<Company> UpdateAsync(Company entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (!ExistsId(entity.Id)) throw new NotFoundException<Company>(entity.Id);

            Context.Update(entity);
            await Context.SaveChangesAsync();

            return entity;
        }

        private bool ExistsId(string id)
        {
            return Context.Companies.Any(e => e.Id == id);
        }
    }
}
