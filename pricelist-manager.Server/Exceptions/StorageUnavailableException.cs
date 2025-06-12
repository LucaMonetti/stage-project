namespace pricelist_manager.Server.Exceptions
{
    public class StorageUnavailableException : Exception
    {
        public StorageUnavailableException()
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
