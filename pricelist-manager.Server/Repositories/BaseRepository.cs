using pricelist_manager.Server.Data;
using pricelist_manager.Server.Interfaces;

namespace pricelist_manager.Server.Repositories
{
    public class BaseRepository : IBaseRepository
    {
        protected readonly DataContext Context;

        public BaseRepository(DataContext dataContext)
        {
            Context = dataContext;
        }

        public bool CanConnect()
        {
            return Context.Database.CanConnect();
        }
    }
}
