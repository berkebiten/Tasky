using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class ProjectContext : DbContext
    {
        public ProjectContext(DbContextOptions<ProjectContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<VW_Project>(eb =>
                {
                    eb.HasNoKey();
                    eb.ToView("VW_Project");
                });
        }

        public DbSet<Project> Project { get; set; }

        public virtual DbSet<VW_Project> VW_Project { get; set; }
    }
}