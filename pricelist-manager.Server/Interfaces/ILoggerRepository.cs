using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface ILoggerRepository<T> : IBaseRepository
    {
        Task<Boolean> LogAsync(T logEntry, string actorId, DatabaseOperationType operationType);
    }
}
