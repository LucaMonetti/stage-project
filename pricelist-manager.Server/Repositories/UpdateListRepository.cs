using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.DTOs.V1.QueryParams;
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

        public async Task<ICollection<ProductToUpdateList>> AddProducts(ICollection<ProductToUpdateList> dto)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (dto.Count != 0)
            {
                await Context.ProductsToUpdateLists.AddRangeAsync(dto);
            }

            await Context.SaveChangesAsync();

            return dto;
        }
        public async Task<ICollection<ProductToUpdateList>> RemoveProducts(ICollection<ProductToUpdateList> dto)
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

            await Context.SaveChangesAsync();

            return dto;
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

        public async Task<UpdateList> DeleteAsync(int id)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var item = await Context.UpdateLists.FirstOrDefaultAsync(ul => ul.Id == id);

            if (item == null)
                throw new NotFoundException<UpdateList>(id);

            var data = Context.UpdateLists.Remove(item);
            var res = await Context.SaveChangesAsync();

            return data.Entity;
        }

        public async Task<PagedList<UpdateList>> GetAllAsync(UpdateListQueryParams requestParams)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var query = Context.UpdateLists
                .Include(ul => ul.ProductsToUpdateLists)
                .ThenInclude(ptul => ptul.Product)
                .ThenInclude(p => p.Versions)
                .ThenInclude(v => v.UpdatedBy);

            return await PagedList<UpdateList>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<UpdateList> GetByIdAsync(int id)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var res = await Context.UpdateLists
                .Include(ul => ul.ProductsToUpdateLists)
                .ThenInclude(ptul => ptul.Product)
                .ThenInclude(p => p.Versions)
                .ThenInclude(v => v.UpdatedBy)
                .FirstOrDefaultAsync(ul => ul.Id == id);

            if (res == null)
                throw new NotFoundException<UpdateList>(id);

            return res;
        }

        public async Task<ICollection<ProductToUpdateList>> GetProductsByList(int id, UpdateListQueryParams requestParams)
        {
            Console.WriteLine("TESTTT", requestParams.ToString());

            if (!CanConnect())
                throw new StorageUnavailableException();

            var res = await Context.ProductsToUpdateLists.Where(ptul => ptul.UpdateListId == id &&
                (requestParams.status.HasValue ? requestParams.status.Value == ptul.Status : true)).Include(ptul => ptul.Product).ThenInclude(p => p.Versions).ThenInclude(v => v.UpdatedBy).ToListAsync();

            if (res == null)
                throw new NotFoundException<UpdateList>(id);

            return res;
        }

        public async Task<ProductToUpdateList> GetProductByCode(int updatelistId, string productId)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var res = await Context.ProductsToUpdateLists.Where(ptul => ptul.UpdateListId == updatelistId &&
                ptul.ProductId == productId).Include(ptul => ptul.Product).ThenInclude(p => p.Versions).ThenInclude(v => v.UpdatedBy).FirstOrDefaultAsync();

            if (res == null)
                throw new NotFoundException<ProductToUpdateList>(updatelistId);

            return res;
        }

        public async Task<PagedList<Product>> GetAvailableProducts(int id, ProductQueryParams requestParams)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var updatelist = await Context.UpdateLists
            .FirstOrDefaultAsync(ul => ul.Id == id) ?? throw new NotFoundException<UpdateList>(id);

            var existingIds = await Context.ProductsToUpdateLists
            .Where(ptul => ptul.UpdateListId == id)
            .Select(ptul => ptul.ProductId)
            .ToListAsync();

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

            var availableProducts = query
                .Where(p => p.CompanyId == updatelist.CompanyId && !existingIds.Contains(p.Id))
                .Include(p => p.Versions)
                .ThenInclude(v => v.UpdatedBy)
                .Include(p => p.Pricelist)
                .Include(p => p.Company);

            return await PagedList<Product>.ToPagedList(availableProducts, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<ICollection<ProductToUpdateList>> GetProductsByList(int id)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var res = await Context.ProductsToUpdateLists.Where(ptul => ptul.UpdateListId == id).Include(ptul => ptul.Product).ThenInclude(p => p.Versions).ThenInclude(v => v.UpdatedBy).ToListAsync();

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

        public async Task<PagedList<UpdateList>> GetByCompanyAsync(string companyId, UpdateListQueryParams requestParams)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            var query = Context.UpdateLists
                .Where(ul => ul.CompanyId == companyId)
                .Include(ul => ul.ProductsToUpdateLists)
                .ThenInclude(ptul => ptul.Product)
                .ThenInclude(p => p.Versions)
                .ThenInclude(v => v.UpdatedBy);

            return await PagedList<UpdateList>.ToPagedList(query, requestParams.Pagination.PageNumber, requestParams.Pagination.PageSize);
        }

        public async Task<UpdateList> UpdateAsync(UpdateList dto)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (!existsID(dto.Id))
                throw new AlreadyExistException<UpdateList>(dto.Id);

            var data = Context.UpdateLists.Update(dto);
            var res = await Context.SaveChangesAsync();

            return data.Entity;
        }

        public async Task<ProductToUpdateList> UpdateProductStatusAsync(string productId, int editUpdateList, Status status)
        {
            if (!CanConnect())
                throw new StorageUnavailableException();

            if (!existsProduct(editUpdateList, productId))
                throw new AlreadyExistException<ProductToUpdateList>($"{productId} nella lista {editUpdateList}");

            var item = Context.ProductsToUpdateLists.First(ptul => ptul.UpdateListId == editUpdateList && ptul.ProductId == productId);

            item.Status = status;

            var data = Context.ProductsToUpdateLists.Update(item);
            var res = await Context.SaveChangesAsync();

            return data.Entity;
        }

        public async Task DeleteProductAndUpdateStatus(int updateListId, string productId)
        {
            using var transaction = await Context.Database.BeginTransactionAsync();

            try
            {
                // 1. Remove the product (single query with joins if needed)
                var removedCount = await Context.ProductsToUpdateLists
                    .Where(p => p.UpdateListId == updateListId && p.ProductId == productId)
                    .ExecuteDeleteAsync(); // EF Core 7+ bulk delete

                if (removedCount == 0)
                {
                    throw new NotFoundException<ProductToUpdateList>($"Product {productId} not found in update list {updateListId}");
                }

                // 2. Check remaining pending products and update status in one query
                var pendingCount = await Context.ProductsToUpdateLists
                    .CountAsync(p => p.UpdateListId == updateListId && p.Status == Status.Pending);

                if (pendingCount == 0)
                {
                    await Context.UpdateLists
                        .Where(ul => ul.Id == updateListId && ul.Status != Status.Edited)
                        .ExecuteUpdateAsync(ul => ul.SetProperty(u => u.Status, Status.Edited));
                }

                await transaction.CommitAsync();
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
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
