using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUpdateListRepository: IBaseRepository
    {
        Task<ICollection<UpdateList>> GetAllAsync();
        Task<ICollection<ProductToUpdateList>> GetProductsByList(int id);
        
        Task<UpdateList> GetByIdAsync(int id);

        Task<UpdateList> CreateAsync(UpdateList dto);
        Task<Boolean> UpdateAsync(UpdateList dto);
        Task<Boolean> UpdateProductStatusAsync(string productId, int editUpdateList, Status status);

        Task<Boolean> DeleteAsync(int id);

        Task<Boolean> AddProducts(ICollection<ProductToUpdateList> dto);
        Task<Boolean> RemoveProducts(ICollection<ProductToUpdateList> dto);
    }
}
