using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;

namespace pricelist_manager.Server.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductInstance> ProductInstances { get; set; }
        public DbSet<Pricelist> Pricelists { get; set; }
    }
}
