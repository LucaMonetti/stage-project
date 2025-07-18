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
        public DbSet<UpdateList> UpdateLists { get; set; }
        public DbSet<ProductToUpdateList> ProductsToUpdateLists { get; set; }

        // Loggers
        public DbSet<CompanyLogger> CompanyLoggers { get; set; }
        public DbSet<PricelistLogger> PricelistLoggers { get; set; }
        public DbSet<UserLogger> UserLoggers { get; set; }
        public DbSet<UpdateListLogger> UpdateListLoggers { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Products - ProductInstances
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

            // Company - Products
            builder.Entity<Company>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Company)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Product>()
                .HasOne(p => p.Company)
                .WithMany(c => c.Products)
                .OnDelete(DeleteBehavior.NoAction);

            // Company - Pricelists
            builder.Entity<Company>()
                .HasMany(c => c.Pricelists)
                .WithOne(p => p.Company)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Pricelist>()
                .HasOne(p => p.Company)
                .WithMany(c => c.Pricelists)
                .OnDelete(DeleteBehavior.Cascade);

            // Pricelists - Products
            builder.Entity<Pricelist>()
                .HasMany(c => c.Products)
                .WithOne(p => p.Pricelist)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Product>()
                .HasOne(p => p.Pricelist)
                .WithMany(c => c.Products)
                .OnDelete(DeleteBehavior.Cascade);

            // UpdateList - ProductToUpdateList - Product

            builder.Entity<ProductToUpdateList>()
                .HasKey(ptul => new { ptul.UpdateListId, ptul.ProductId });

            builder.Entity<ProductToUpdateList>()
                .HasOne(ptul => ptul.Product)
                .WithMany(p => p.ProductsToUpdateLists)
                .HasForeignKey(ptul => ptul.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductToUpdateList>()
                .HasOne(ptul => ptul.UpdateList)
                .WithMany(ul => ul.ProductsToUpdateLists)
                .HasForeignKey(ptul => ptul.UpdateListId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<UpdateList>()
                .HasMany(ul => ul.ProductsToUpdateLists)
                .WithOne(ptul => ptul.UpdateList)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Product>()
                .HasMany(ul => ul.ProductsToUpdateLists)
                .WithOne(ptul => ptul.Product)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
