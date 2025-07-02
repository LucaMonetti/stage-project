using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Repositories
{
    public class ProductInstanceRepository : BaseRepository, IProductInstanceRepository
    {
        public ProductInstanceRepository(DataContext dataContext) : base(dataContext) { }

        public async Task<ICollection<ProductInstance>> GetAllAsync(string productId)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var productInstances = await Context.ProductInstances.Where(pi => pi.ProductId == productId).ToListAsync();

            if (!productInstances.Any()) throw new NotFoundException<Product>(productId);

            return productInstances;
        }

        public async Task<ProductInstance> GetByVersionAsync(string productId, int version)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var productInstance = await Context.ProductInstances.Where(pi => pi.ProductId == productId && pi.Version == version).FirstOrDefaultAsync();

            if (productInstance == null) throw new NotFoundException<ProductInstance>($"{productId} versione {version}");

            return productInstance;
        }

        public async Task<bool> CreateAsync(ProductInstance productInstance)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            await Context.ProductInstances.AddAsync(productInstance);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

    }
}
