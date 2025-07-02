using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Mappers
{
    public class UserLiteMappingService : IUserLiteMappingService
    {

        public UserLiteDTO MapToLiteDTO(User user)
        {
            ArgumentNullException.ThrowIfNull(user);

            return new UserLiteDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.UserName,
                Phone = user.PhoneNumber,
            };
        }

        public ICollection<UserLiteDTO> MapToLiteDTOs(ICollection<User> users)
        {
            ArgumentNullException.ThrowIfNull(users);

            return [.. users.Select(u => MapToLiteDTO(u))];
        }
    }
}
