using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.Statistics;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using System.Reflection;

namespace pricelist_manager.Server.Repositories
{
    public class ProductRepository : BaseRepository, IProductRepository
    {
        public ProductRepository(DataContext dataContext) : base(dataContext)
        {}

        public async Task<ICollection<Product>> GetAllProductsWithPricelistsAsync()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var res = await Context.Products
                .Include(p => p.Versions)
                .Include(p => p.Pricelist)
                .ToListAsync();

            Console.Write($"DEBUG: Repository {res.Count},[0] {res.ElementAt(0).Versions.Count}");

            return res;
        }

        public async Task<bool> UpdateAsync(Product entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (!(await existsIdAsync(entity.PricelistId, entity.ProductCode))) throw new NotFoundException<Product>(entity.ProductCode);

            Context.Products.Update(entity);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        public async Task<bool> ExistsIdAsync(Guid pricelistId, string productCode)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            return await existsIdAsync(pricelistId, productCode);
        }

        private async Task<bool> existsIdAsync(Guid pricelistId, string productCode)
        {
            return await Context.Products.AnyAsync(pi => pi.PricelistId == pricelistId && pi.ProductCode == productCode);
        }

        public async Task<ICollection<Product>> GetAllAsync(Guid pricelistId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var products = await Context.Products.Where(p => p.PricelistId == pricelistId).Include(p => p.Versions.OrderByDescending(v => v.Version)).ToListAsync();

            TrimProductsVersion(products);

            return products;
        }

        public async Task<Product> GetByIdAsync(Guid pricelistId, string productCode)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var product = await Context.Products
                                    .Where(p => p.ProductCode == productCode && p.PricelistId == pricelistId)
                                    .Include(p => p.Versions)
                                    .FirstOrDefaultAsync();

            if (product == null) throw new NotFoundException<Product>(productCode);

            TrimProductVersion(product);

            return product;
        }

        public async Task<ICollection<Product>> GetByNameAsync(string name)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var product = await Context.Products
                                    .Where(p => p.Versions.Last().Name.Contains(name))
                                    .Include(p => p.Versions)
                                    .ToListAsync();

            TrimProductsVersion(product);

            if (product == null) throw new NotFoundException<Product>(name);

            return product;
        }

        public async Task<ICollection<Product>> GetByCodeAsync(string code)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var product = await Context.Products
                                    .Where(p => p.ProductCode == code)
                                    .Include(p => p.Versions)
                                    .ToListAsync();

            TrimProductsVersion(product);

            if (product == null) throw new NotFoundException<Product>(code);

            return product;
        }

        public async Task<bool> CreateAsync(Product entity)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            if (await existsIdAsync(entity.PricelistId, entity.ProductCode)) throw new AlreadyExistException<Product>(entity.ProductCode);

            await Context.Products.AddAsync(entity);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        public async Task<bool> DeleteAsync(Guid pricelistId, string productCode)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var product = await Context.Products.FirstOrDefaultAsync(p => p.PricelistId == pricelistId && p.ProductCode == productCode);

            if (product == null) throw new NotFoundException<Product>(productCode);

            Context.Products.Remove(product);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        private void TrimProductsVersion(List<Product> products)
        {
            foreach (var product in products)
                TrimProductVersion(product);
        }

        private void TrimProductsVersion(List<IGrouping<Guid, Product>> products)
        {
            foreach (var pricelist in products)
                foreach (var product in pricelist)
                    TrimProductVersion(product);
        }

        private void TrimProductVersion(Product product)
        {
            foreach (var version in product.Versions)
            {
                version.Product = null!;
            }
        }

        public async Task<ProductStatistics> GetStatistics()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var uniqueProdCount = await Context.Products.Select(p => p.ProductCode).Distinct().CountAsync();
            var prodInstanceCount = await Context.Products.CountAsync();

            var data = new ProductStatistics
            {
                UniqueCount = uniqueProdCount,
                TotalRegistered = prodInstanceCount,
            };

            return data;
        }

        public async Task<ICollection<IGrouping<Guid, Product>>> GetAllGroupPricelistAsync()
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var products = await Context.Products.Include(p => p.Versions).ToListAsync();
            var groupedProd = products.GroupBy(p => p.PricelistId).ToList();

            TrimProductsVersion(groupedProd);

            return groupedProd;
        }
    }
}
