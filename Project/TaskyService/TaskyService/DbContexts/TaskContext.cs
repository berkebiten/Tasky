using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class TaskContext : DbContext
    {
        public TaskContext(DbContextOptions<TaskContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<VW_Project>(eb =>
                {
                    eb.HasNoKey();
                    eb.ToView("VW_Task");
                });
        }

        public DbSet<Task> Task { get; set; }

        public virtual DbSet<VW_Task> VW_Task { get; set; }

    }
}