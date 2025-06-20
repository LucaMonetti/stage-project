using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.DTOs;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using System.Globalization;

namespace pricelist_manager.Server.Controllers
{
    [ApiController]
    [Route("api/companies")]
    public class CompaniesController: ControllerBase
    {
        private readonly ICompanyRepository CompanyRepository;
        private readonly IUserRepository UserRepository;

        public CompaniesController(ICompanyRepository companyRepository, IUserRepository userRepository)
        {
            CompanyRepository = companyRepository;
            UserRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var res = await CompanyRepository.GetAllAsync();

            return Ok(res);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await CompanyRepository.GetByIdAsync(id);
                return Ok(res);
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("{id}/accounts")]
        public async Task<ActionResult<ICollection<UserDTO>>> GetAccountByCompany(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var res = await UserRepository.GetByCompany(id);

            return Ok(UserDTO.FromUsers(res));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Company dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var data = dto;

            try
            {
                var res = await CompanyRepository.CreateAsync(data);
                return Ok(res);
            }
            catch (AlreadyExistException<Company> e)
            {
                return Conflict(e.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Company dto)
        {
            if (id != dto.Id)
            {
                ModelState.AddModelError("", "The IDs doesn't match!");
                return BadRequest(ModelState);
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await CompanyRepository.UpdateAsync(dto);
                return Ok(res);
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var res = await CompanyRepository.DeleteAsync(id);
                return Ok(res);
            }
            catch (NotFoundException<Company> e)
            {
                return NotFound(e.Message);
            }
        }
    }
}
