using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Helpers;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUserMappingService
    {
        UserDTO MapToDTO(User company, ICollection<string> roles);

        User MapToUser(CreateUserDTO dto);
        User MapToUser(UserDTO dto);

        ICollection<UserDTO> MapToDTOs(ICollection<(User user, ICollection<string> roles)> users);
        ICollection<User> MapToUsers(ICollection<UserDTO> dtos);
    }
}
