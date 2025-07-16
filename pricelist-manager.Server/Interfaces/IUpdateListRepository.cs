using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.DTOs.V1.QueryParams;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUpdateListRepository : IBaseRepository
    {
        Task<PagedList<UpdateList>> GetAllAsync(UpdateListQueryParams requestParams);
        Task<PagedList<Product>> GetAvailableProducts(int id, UpdateListQueryParams requestParams);
        Task<ICollection<ProductToUpdateList>> GetProductsByList(int id, UpdateListQueryParams requestParams);
        Task<ICollection<ProductToUpdateList>> GetProductsByList(int id);
        Task<ICollection<ProductToUpdateList>> GetProductsByStatus(int updateListId, Status status);
        Task<PagedList<UpdateList>> GetByCompanyAsync(string companyId, UpdateListQueryParams requestParams);

        Task<UpdateList> GetByIdAsync(int id);

        Task<UpdateList> CreateAsync(UpdateList dto);
        Task<UpdateList> UpdateAsync(UpdateList dto);
        Task<ProductToUpdateList> UpdateProductStatusAsync(string productId, int editUpdateList, Status status);

        Task<UpdateList> DeleteAsync(int id);

        Task<ICollection<ProductToUpdateList>> AddProducts(ICollection<ProductToUpdateList> dto);
        Task<ICollection<ProductToUpdateList>> RemoveProducts(ICollection<ProductToUpdateList> dto);
    }
}
