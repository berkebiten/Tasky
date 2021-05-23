using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class WorkLogContext : DbContext
    {
        public WorkLogContext(DbContextOptions<WorkLogContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<VW_WorkLog>(eb =>
                {
                    eb.HasNoKey();
                    eb.ToView("VW_WorkLog");
                });
        }

        public DbSet<WorkLog> WorkLog { get; set; }

        public virtual DbSet<VW_WorkLog> VW_WorkLog { get; set; }
    }
}