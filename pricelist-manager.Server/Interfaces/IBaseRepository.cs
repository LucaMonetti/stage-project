namespace pricelist_manager.Server.Interfaces
{
    public interface IBaseRepository
    {
        /// <summary>
        /// Check if the application can reach the database.
        /// </summary>
        /// <returns><see langword="true" /> if the database is available; <see langword="false" /> otherwise</returns>
        Boolean CanConnect();
    }
}
