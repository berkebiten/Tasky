using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<VW_RecentProjects>(eb =>
                {
                    eb.HasNoKey();
                    eb.ToView("VW_RecentProjects");
                });
        }

        public DbSet<User> User { get; set; }

        public virtual DbSet<VW_RecentProjects> VW_RecentProjects { get; set; }
    }
}