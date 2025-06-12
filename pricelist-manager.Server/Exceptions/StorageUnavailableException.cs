namespace pricelist_manager.Server.Exceptions
{
    public class StorageUnavailableException : Exception
    {
        public StorageUnavailableException() : base("The database is Unavailable.")
        {
        }

        public StorageUnavailableException(string message)
            : base(message)
        {
        }

        public StorageUnavailableException(string message, Exception inner)
            : base(message, inner)
        {
        }
    }
}
