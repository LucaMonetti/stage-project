using Microsoft.AspNetCore.Mvc;
using pricelist_manager.Server.Interfaces;

namespace pricelist_manager.Server.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository ProductRepository;
        private readonly IProductInstanceRepository productInstanceRepository;

        public ProductsController(IProductRepository productRepository, IProductInstanceRepository productInstanceRepository)
        {
            ProductRepository = productRepository;
            this.productInstanceRepository = productInstanceRepository;
        }


    }
}
