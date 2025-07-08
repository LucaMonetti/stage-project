using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Repositories
{
    public class UpdateListRepository : BaseRepository, IUpdateListRepository
    {
        public UpdateListRepository(DataContext dataContext) : base(dataContext)
        { }

        public async Task<bool> AddProducts(ICollection<ProductToUpdateList> dto)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (dto.Count != 0)
            {
                await Context.ProductsToUpdateLists.AddRangeAsync(dto);
            }

            var res = await Context.SaveChangesAsync();

            return res > 0;
        }
        public async Task<bool> RemoveProducts(ICollection<ProductToUpdateList> dto)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (dto.Count != 0)
            {
                var idsToRemove = dto.Select(p => p.ProductId).ToList();
                await Context.ProductsToUpdateLists
                    .Where(p => idsToRemove.Contains(p.ProductId))
                    .ExecuteDeleteAsync();
            }

            var res = await Context.SaveChangesAsync();

            return res > 0;
        }

        public async Task<UpdateList> CreateAsync(UpdateList dto)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (existsID(dto.Id))
                throw new AlreadyExistException<UpdateList>(dto.Id);

            var item = await Context.AddAsync(dto);
            var res = await Context.SaveChangesAsync();


            // ToDo(Luca): Create a better exception
            if (item == null)
                throw new StorageUnavailableException();

            return item.Entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var item = await Context.UpdateLists.FirstOrDefaultAsync(ul => ul.Id == id);

            if (item == null)
                throw new NotFoundException<UpdateList>(id);

            Context.UpdateLists.Remove(item);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        public async Task<PagedList<UpdateList>> GetAllAsync()
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var query = Context.UpdateLists
                .Include(ul => ul.ProductsToUpdateLists)
                .ThenInclude(ptul => ptul.Product)
                .ThenInclude(p => p.Versions);

            return await PagedList<UpdateList>.ToPagedList(query, 1, 10);
        }

        public async Task<UpdateList> GetByIdAsync(int id)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var res = await Context.UpdateLists
                .Include(ul => ul.ProductsToUpdateLists)
                .ThenInclude(ptul => ptul.Product)
                .ThenInclude(p => p.Versions)
                .FirstOrDefaultAsync(ul => ul.Id == id);

            if (res == null)
                throw new NotFoundException<UpdateList>(id);

            return res;
        }

        public async Task<ICollection<ProductToUpdateList>> GetProductsByList(int id)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var res = await Context.ProductsToUpdateLists.Where(ptul => ptul.UpdateListId == id).ToListAsync();

            if (res == null)
                throw new NotFoundException<UpdateList>(id);

            return res;
        }

        public async Task<ICollection<ProductToUpdateList>> GetProductsByStatus(int updateListId, Status status)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var res = await Context.ProductsToUpdateLists.Where(ptul => ptul.UpdateListId == updateListId && ptul.Status == status).ToListAsync();

            if (res == null)
                throw new NotFoundException<UpdateList>(updateListId);

            return res;
        }

        public  async Task<bool> UpdateAsync(UpdateList dto)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (!existsID(dto.Id))
                throw new AlreadyExistException<UpdateList>(dto.Id);

            Context.UpdateLists.Update(dto);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        public async Task<bool> UpdateProductStatusAsync(string productId, int editUpdateList, Status status)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (!existsProduct(editUpdateList, productId))
                throw new AlreadyExistException<ProductToUpdateList>($"{productId} nella lista {editUpdateList}");

            var item = Context.ProductsToUpdateLists.First(ptul => ptul.UpdateListId == editUpdateList && ptul.ProductId == productId);

            item.Status = status;
            
            Context.ProductsToUpdateLists.Update(item);
            var res = await Context.SaveChangesAsync();

            return res >= 1;
        }

        private bool existsID(int id)
        {
            return Context.UpdateLists.Any(ul => ul.Id == id);
        }

        private bool existsProduct(int updateListId, string productId)
        {
            return Context.ProductsToUpdateLists.Any(ptul => ptul.UpdateListId == updateListId && ptul.ProductId == productId);
        }
    }
}
