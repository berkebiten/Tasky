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

        public DbSet<Project> Project { get; set; }
    }
}