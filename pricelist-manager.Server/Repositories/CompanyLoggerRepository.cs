using Microsoft.AspNetCore.Http.Features;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Repositories
{
    public class CompanyLoggerRepository : BaseRepository, ILoggerRepository<Company>
    {

        public CompanyLoggerRepository(DataContext context) : base(context)
        { }

        public async Task<bool> LogAsync(Company logEntry, string actorId, DatabaseOperationType operation)
        {
            if (!CanConnect()) throw new StorageUnavailableException();

            var item = new CompanyLogger
            {
                CompanyId = logEntry.Id,
                ActorId = actorId,
                Operation = operation,
                Timestamp = DateTime.Now,
            };

            await Context.CompanyLoggers.AddAsync(item);
            var res = await Context.SaveChangesAsync();

            return res > 0;
        }
    }
}