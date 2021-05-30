using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class TaskOperationContext : DbContext
    {
        public TaskOperationContext(DbContextOptions<TaskOperationContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<VW_TaskOperation>(eb =>
                {
                    eb.HasNoKey();
                    eb.ToView("VW_TaskOperation");
                });
        }

        public DbSet<TaskOperation> TaskOperation { get; set; }

        public virtual DbSet<VW_TaskOperation> VW_TaskOperation { get; set; }
    }
}