namespace pricelist_manager.Server.Helpers
{
    public class Roles
    {
        public const string ADMIN = "Admin";
        public const string USER = "User";

        public static List<string> GetAllRoles()
        {
            return [ADMIN, USER];
        }

        // Optional: Check if a role is valid
        public static bool IsValidRole(string role)
        {
            return GetAllRoles().Contains(role);
        }

    }
}
