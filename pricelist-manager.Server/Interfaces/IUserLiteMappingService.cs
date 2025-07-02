using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Interfaces
{
    public interface IUserLiteMappingService
    {
        UserLiteDTO MapToLiteDTO(User company);

        ICollection<UserLiteDTO> MapToLiteDTOs(ICollection<User> users);
    }
}
