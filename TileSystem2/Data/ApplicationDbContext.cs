
using Microsoft.EntityFrameworkCore;
using TileSystem2.Models;

namespace TileSystem2.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<users> users { get; set; } // Maps to SQL table 'users'
    }
}
