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

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries<Product>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.Id = $"{entry.Entity.CompanyId}-{entry.Entity.ProductCode}";
                }
            }
            return base.SaveChanges();
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Product>()
                .HasMany(p => p.Versions)
                .WithOne(pi => pi.Product)
                .HasForeignKey(pi => pi.ProductId)
                .HasPrincipalKey(p => p.Id)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<ProductInstance>()
                .HasOne(pi => pi.Product)
                .WithMany(p => p.Versions)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
