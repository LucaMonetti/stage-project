using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.DTOs.V1.Statistics;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.Reflection;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace pricelist_manager.Server.Repositories
{
    public class ProductRepository : BaseRepository, IProductRepository
    {
        public ProductRepository(DataContext dataContext) : base(dataContext)
        { }

        public async Task<Product> UpdateAsync(Product entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (!(await existsIdAsync(entity.Id))) throw new NotFoundException<Product>(entity.ProductCode);

            Context.Products.Update(entity);
            await Context.SaveChangesAsync();

            return entity;
        }

        public async Task<bool> ExistsIdAsync(string productId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            return await existsIdAsync(productId);
        }

        private async Task<bool> existsIdAsync(string productId)
        {
            return await Context.Products.AnyAsync(pi => pi.Id == productId);
        }

        public async Task<PagedList<Product>> GetAllAsync(ProductQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Products.AsQueryable();

            if (requestParams.Filters != null)
            {
                if (!string.IsNullOrEmpty(requestParams.Filters.ProductCode))
                {
                    query = query.Where(p => p.ProductCode.Contains(requestParams.Filters.ProductCode));
                }

                if (!string.IsNullOrEmpty(requestParams.Filters.CompanyId))
                {
                    query = query.Where(p => p.CompanyId == requestParams.Filters.CompanyId);
                }

                if (requestParams.Filters.PricelistId.HasValue)
                {
                    query = query.Where(p => p.PricelistId == requestParams.Filters.PricelistId.Value);
                }
            }

            query = query
                .Include(p => p.Versions.OrderByDescending(v => v.Version))
                .ThenInclude(v => v.UpdatedBy)
                .Include(p => p.Pricelist)
                .Include(p => p.Company);

            return await PagedList<Product>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<PagedList<Product>> GetByPricelistAsync(Guid pricelistId, ProductQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Products
                .Where(p => p.PricelistId == pricelistId)
                .Include(p => p.Versions.OrderByDescending(v => v.Version))
                .ThenInclude(v => v.UpdatedBy)
                .Include(p => p.Pricelist)
                .Include(p => p.Company);

            return await PagedList<Product>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<Product> GetByIdAsync(string productId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var product = await Context.Products
                                    .Where(p => p.Id == productId)
                                    .Include(p => p.Versions.OrderByDescending(v => v.Version))
                                    .ThenInclude(v => v.UpdatedBy)
                                    .Include(p => p.Pricelist)
                                    .Include(p => p.Company)
                                    .FirstOrDefaultAsync();

            if (product == null) throw new NotFoundException<Product>(productId);

            return product;
        }

        public async Task<ICollection<Product>> GetByIdsAsync(ICollection<string> productIds)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var product = await Context.Products
                                    .Where(p => productIds.Contains(p.Id))
                                    .Include(p => p.Versions.OrderByDescending(v => v.Version))
                                    .ThenInclude(v => v.UpdatedBy)
                                    .Include(p => p.Pricelist)
                                    .Include(p => p.Company)
                                    .ToListAsync();

            if (product == null) throw new NotFoundException<Product>(productIds.Aggregate((prev, item) => $"${prev}, item"));

            return product;
        }

        public async Task<PagedList<Product>> GetByNameAsync(string name, ProductQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Products
                            .Where(p => p.Versions.Last().Name.Contains(name))
                            .Include(p => p.Versions.OrderByDescending(v => v.Version))
                            .ThenInclude(v => v.UpdatedBy)
                            .Include(p => p.Pricelist)
                            .Include(p => p.Company);

            return await PagedList<Product>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<PagedList<Product>> GetByCodeAsync(string code, ProductQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Products
                            .Where(p => p.ProductCode == code)
                            .Include(p => p.Versions.OrderByDescending(v => v.Version))
                            .ThenInclude(v => v.UpdatedBy)
                            .Include(p => p.Pricelist)
                            .Include(p => p.Company);

            return await PagedList<Product>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<PagedList<Product>> GetByCompany(string companyId, ProductQueryParams? requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var query = Context.Products
                            .Where(p => p.CompanyId == companyId)
                            .Include(p => p.Versions.OrderByDescending(v => v.Version))
                            .ThenInclude(v => v.UpdatedBy)
                            .Include(p => p.Pricelist)
                            .Include(p => p.Company);

            return await PagedList<Product>.ToPagedList(query, requestParams?.Pagination.PageNumber ?? 1, requestParams?.Pagination.PageSize ?? -1);
        }

        public async Task<Product> CreateAsync(Product entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (await existsIdAsync(entity.Id)) throw new AlreadyExistException<Product>(entity.Id);

            await Context.Products.AddAsync(entity);
            await Context.SaveChangesAsync();

            return entity;
        }

        public async Task<Product> DeleteAsync(string productId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var product = await Context.Products.FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null) throw new NotFoundException<Product>(productId);

            Context.Products.Remove(product);
            await Context.SaveChangesAsync();

            return product;
        }

        public async Task<ProductStatistics> GetStatistics(string? companyId = null)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            int uniqueProdCount;
            int prodInstanceCount;

            if (companyId != null)
            {
                uniqueProdCount = await Context.Products
                    .Where(p => p.CompanyId == companyId)
                    .Select(p => p.ProductCode)
                    .Distinct()
                    .CountAsync();

                prodInstanceCount = await Context.Products
                    .Where(p => p.CompanyId == companyId)
                    .CountAsync();
            }
            else
            {
                uniqueProdCount = await Context.Products.Select(p => p.ProductCode).Distinct().CountAsync();
                prodInstanceCount = await Context.Products.CountAsync();
            }

            var data = new ProductStatistics
            {
                UniqueCount = uniqueProdCount,
                TotalRegistered = prodInstanceCount,
            };

            return data;
        }

        public async Task<PagedList<IGrouping<Guid, Product>>> GetAllGroupPricelistAsync(ProductQueryParams requestParams)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var products = await Context.Products.Include(p => p.Versions).ThenInclude(v => v.UpdatedBy).ToListAsync();
            var groupedProd = products.GroupBy(p => p.PricelistId).AsQueryable();

            return await PagedList<IGrouping<Guid, Product>>.ToPagedList(groupedProd, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<bool> ImportProductsAsync(ICollection<Product> products, string companyId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var existringProducts = Context.Products.Where(p => p.CompanyId == companyId).Select(p => p.Id).ToHashSet();

            Context.Products.AddRange(products.Where(p => !existringProducts.Contains(p.Id)));
            var res = await Context.SaveChangesAsync();

            return res > 0;
        }

        public async Task<ICollection<Product>> UpdateListAsync(ICollection<Product> entities)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var entitiesToUpdate = new List<Product>();

            foreach (var entity in entities)
            {
                if (await existsIdAsync(entity.Id))
                {
                    entitiesToUpdate.Add(entity);
                }
            }

            Context.Products.UpdateRange(entitiesToUpdate);
            await Context.SaveChangesAsync();

            return entitiesToUpdate;
        }
    }
}
