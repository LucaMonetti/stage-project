namespace pricelist_manager.Server.Exceptions
{
    public class AlreadyExistException<T> : Exception
        where T : class
    {
        private object Id { get; }
        private string EntityName { get; }

        public AlreadyExistException(object id)
            : base(GenerateMessage(typeof(T).Name, id))
        {
            Id = id;
            EntityName = typeof(T).Name;
        }

        public AlreadyExistException(object id, string message)
            : base(message)
        {
            Id = id;
            EntityName = typeof(T).Name;
        }

        public AlreadyExistException(object id, string message, Exception innerException)
            : base(message, innerException)
        {
            Id = id;
            EntityName = typeof(T).Name;
        }

        private static string GenerateMessage(string entityName, object id)
        {
            return $"The {entityName.ToLower()} with Id {id} already exist.";
        }
    }
}
