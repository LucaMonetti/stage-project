using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.DTOs.V1;
using pricelist_manager.Server.Exceptions;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using System.Globalization;

namespace pricelist_manager.Server.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/companies")]
    public class CompaniesController: ControllerBase
    {
        private readonly ICompanyRepository CompanyRepository;
        private readonly IProductRepository ProductRepository;
        private readonly IPricelistRepository PricelistRepository;
        private readonly IUserRepository UserRepository;

        public CompaniesController(ICompanyRepository companyRepository, IUserRepository userRepository, IProductRepository productRepository, IPricelistRepository pricelistRepository)
        {
            CompanyRepository = companyRepository;
            UserRepository = userRepository;
            ProductRepository = productRepository;
            PricelistRepository = pricelistRepository;
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

        [HttpGet("{id}/products")]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetProductsByCompany(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var res = await ProductRepository.GetByCompany(id);

            return Ok(ProductDTO.FromProducts(res));
        }

        [HttpGet("{id}/pricelists")]
        public async Task<ActionResult<ICollection<ProductDTO>>> GetPricelistsByCompany(string id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var res = await PricelistRepository.GetByCompanyAsync(id);
            var prod = await ProductRepository.GetAllGroupPricelistAsync();

            return Ok(PricelistDTO.FromPricelists(res, prod));
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
