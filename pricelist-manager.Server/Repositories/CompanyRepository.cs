using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.Diagnostics.CodeAnalysis;

namespace pricelist_manager.Server.Repositories
{
    public class CompanyRepository : BaseRepository, ICompanyRepository
    {

        public CompanyRepository(DataContext context) : base(context)
        { }

        public async Task<bool> CreateAsync(Company entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (ExistsId(entity.Id)) throw new AlreadyExistException<Company>(entity.Id);

            try
            {
                await Context.AddAsync(entity);
                await Context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var res = await GetByIdAsync(id);

            try
            {
                Context.Remove(res);
                await Context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<bool> ExistsIdAsync(string id)
        {
            return await Context.Companies.AnyAsync(e => e.Id == id);
        }

        public async Task<ICollection<Company>> GetAllAsync()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            return await Context.Companies.Include(c => c.Products).ThenInclude(p => p.Versions).Include(c => c.Pricelists).ToListAsync();
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

        public async Task<bool> UpdateAsync(Company entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (!ExistsId(entity.Id)) throw new NotFoundException<Company>(entity.Id);

            try
            {
                Context.Update(entity);
                await Context.SaveChangesAsync();
            } catch (Exception)
            {
                return false;
            }

            return true;
        }

        private bool ExistsId(string id)
        {
            return Context.Companies.Any(e => e.Id == id);
        }
    }
}
