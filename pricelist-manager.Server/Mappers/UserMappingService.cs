using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Mappers
{
    public class UserMappingService : IUserMappingService
    {
        private readonly ICompanyLiteMappingService CompanyMapping;

        public UserMappingService(ICompanyLiteMappingService companyLiteMappingService)
        {
            CompanyMapping = companyLiteMappingService;
        }

        public User MapToUser(CreateUserDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new User
            {
                CompanyId = dto.CompanyID,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.Phone,
                UserName = dto.Username,
            };
        }

        public User MapToUser(UserDTO dto)
        {
            ArgumentNullException.ThrowIfNull(dto);

            return new User
            {
                CompanyId = dto.Company.Id,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                PhoneNumber = dto.Phone,
                UserName = dto.Username,
            };
        }

        public UserDTO MapToDTO(User user, ICollection<string> roles)
        {
            ArgumentNullException.ThrowIfNull(user);

            return new UserDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Username = user.UserName,
                Phone = user.PhoneNumber,
                Company = CompanyMapping.MapToLiteDTO(user.Company),
                Roles = roles
            };
        }

        public ICollection<UserDTO> MapToDTOs(ICollection<(User user, ICollection<string> roles)> users)
        {
            ArgumentNullException.ThrowIfNull(users);

            return [.. users.Select(u => MapToDTO(u.user, u.roles))];
        }

        public ICollection<User> MapToUsers(ICollection<UserDTO> dtos)
        {
            ArgumentNullException.ThrowIfNull(dtos);

            return [.. dtos.Select(u => MapToUser(u))];
        }
    }
}
