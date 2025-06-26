using pricelist_manager.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace pricelist_manager.Server.DTOs.V1
{
    public class UserDTO
    {
        public string Id { get; set; } = string.Empty;
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;
        public string? Username { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? Phone { get; set; } = string.Empty;

        public Company Company { get; set; } = null!;

        public static UserDTO FromUser(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.UserName,
                Phone = user.PhoneNumber,
                Company = user.Company
            };
        }

        public static ICollection<UserDTO> FromUsers(ICollection<User> users)
        {
            ICollection<UserDTO> userList = [];

            foreach (var user in users)
            {
                userList.Add(FromUser(user));
            }

            return userList;
        }
    }
}