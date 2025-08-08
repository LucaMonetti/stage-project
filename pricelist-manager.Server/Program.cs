using Asp.Versioning.ApiExplorer;
using Asp.Versioning.Conventions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using pricelist_manager.Server.Data;
using pricelist_manager.Server.Helpers.Token;
using pricelist_manager.Server.Interfaces;
using pricelist_manager.Server.Mappers;
using pricelist_manager.Server.Middlewares;
using pricelist_manager.Server.Models;
using pricelist_manager.Server.Repositories;
using Swashbuckle.AspNetCore.Filters;
using System;
using System.Text;

namespace pricelist_manager.Server
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Database
            builder.Services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            // Authentication
            builder.Services.AddIdentity<User, IdentityRole>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;

                options.SignIn.RequireConfirmedPhoneNumber = false;
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;

                options.User.RequireUniqueEmail = true;
            })
                .AddEntityFrameworkStores<DataContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                };
            });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
                options.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
            });

            // API Versioning
            builder.Services.AddApiVersioning(options =>
            {
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new Asp.Versioning.ApiVersion(1, 0);
                options.ReportApiVersions = true;
            }).AddMvc(options =>
            {
                options.Conventions.Add(new VersionByNamespaceConvention());
            }).AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = true;
            });

            builder.Services.ConfigureOptions<ConfigureSwaggerOptions>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });

                options.OperationFilter<SecurityRequirementsOperationFilter>();
            });

            // Dependency Injecion
            builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
            builder.Services.AddScoped<IPricelistRepository, PricelistRepository>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<IProductInstanceRepository, ProductInstanceRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IUpdateListRepository, UpdateListRepository>();

            builder.Services.AddScoped<ITokenService, TokenService>();

            builder.Services.AddScoped<IProductMappingService, ProductMappingService>();
            builder.Services.AddScoped<IProductLiteMappingService, ProductLiteMappingService>();
            builder.Services.AddScoped<IProductInstanceMappingService, ProductInstanceMappingService>();

            builder.Services.AddScoped<ICompanyMappingService, CompanyMappingService>();
            builder.Services.AddScoped<ICompanyLiteMappingService, CompanyLiteMappingService>();

            builder.Services.AddScoped<IPricelistMappingService, PricelistMappingService>();
            builder.Services.AddScoped<IPricelistLiteMappingService, PricelistLiteMappingService>();

            builder.Services.AddScoped<IUserMappingService, UserMappingService>();
            builder.Services.AddScoped<IUserLiteMappingService, UserLiteMappingService>();

            builder.Services.AddScoped<IUpdateListLiteMappingService, UpdateListLiteMappingService>();
            builder.Services.AddScoped<IUpdateListMappingService, UpdateListMappingService>();
            builder.Services.AddScoped<IProductToUpdateListMappingService, ProductToUpdateListMappingService>();

            builder.Services.AddScoped<IMetadataMappingService, MetadataMappingService>();

            builder.Services.AddScoped<ILoggerRepository<Company>, CompanyLoggerRepository>();
            builder.Services.AddScoped<ILoggerRepository<Pricelist>, PricelistLoggerRepository>();
            builder.Services.AddScoped<ILoggerRepository<UpdateList>, UpdateListLoggerRepository>();
            builder.Services.AddScoped<ILoggerRepository<User>, UserLoggerRepository>();

            var app = builder.Build();

            // Create admin user if no users exist
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<DataContext>();
                    var userManager = services.GetRequiredService<UserManager<User>>();
                    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

                    // Ensure database is created
                    await context.Database.MigrateAsync();

                    // Create roles if they don't exist
                    if (!await roleManager.RoleExistsAsync("Admin"))
                    {
                        await roleManager.CreateAsync(new IdentityRole("Admin"));
                    }
                    if (!await roleManager.RoleExistsAsync("User"))
                    {
                        await roleManager.CreateAsync(new IdentityRole("User"));
                    }

                    // Check if any users exist
                    if (!context.Users.Any())
                    {
                        // Create default company first
                        var defaultCompany = new Company
                        {
                            Id = "PLA",
                            Name = "Planetel S.p.A.",
                            Address = "Via Boffalora, 4 – 24048 Treviolo (BG)",
                            PostalCode = "24048",
                            Province = "BG",
                            Phone = "+39 035 204011",
                            LogoUri = "/src/assets/companies/default.png",
                            InterfaceColor = "#000000"
                        };

                        context.Companies.Add(defaultCompany);
                        await context.SaveChangesAsync();

                        // Create admin user
                        var adminUser = new User
                        {
                            UserName = "Admin",
                            Email = "admin@admin.com",
                            FirstName = "Admin",
                            LastName = "Admin",
                            PhoneNumber = "0000000000",
                            CompanyId = defaultCompany.Id,
                            EmailConfirmed = true
                        };

                        var result = await userManager.CreateAsync(adminUser, "Admin123!");

                        if (result.Succeeded)
                        {
                            await userManager.AddToRoleAsync(adminUser, "Admin");
                            Console.WriteLine("Default admin user created successfully!");
                            Console.WriteLine("Email: admin@admin.com");
                        }
                        else
                        {
                            Console.WriteLine("Failed to create admin user:");
                            foreach (var error in result.Errors)
                            {
                                Console.WriteLine($"- {error.Description}");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An error occurred while creating admin user: {ex.Message}");
                }
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    var providers = app.Services.GetRequiredService<IApiVersionDescriptionProvider>();

                    foreach (var description in providers.ApiVersionDescriptions)
                    {
                        options.SwaggerEndpoint($"/swagger/{description.GroupName}/swagger.json", description.GroupName.ToUpperInvariant());
                    }
                });
            }

            //Middlewares
            app.UseMiddleware<ExceptionMiddleware>();

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            await app.RunAsync();
        }
    }
}
