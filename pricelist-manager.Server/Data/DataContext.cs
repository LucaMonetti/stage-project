using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using pricelist_manager.Server.Models;
using System.Reflection.Emit;

namespace pricelist_manager.Server.Data
{
    public class DataContext : IdentityDbContext<User>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductInstance> ProductInstances { get; set; }
        public DbSet<Pricelist> Pricelists { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Product>()
                .HasMany(p => p.Versions)
                .WithOne(pi => pi.Product)
                .HasForeignKey(pi => new { pi.PricelistId, Id = pi.Id })
                .HasPrincipalKey(p => new { p.PricelistId, Id = p.ProductCode })
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
