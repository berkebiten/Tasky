using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class ProjectParticipantContext : DbContext
    {
        public ProjectParticipantContext(DbContextOptions<ProjectParticipantContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<VW_Project>(eb =>
                {
                    eb.HasNoKey();
                    eb.ToView("VW_ProjectParticipant");
                });
        }

        public DbSet<ProjectParticipant> ProjectParticipant { get; set; }

        public virtual DbSet<VW_ProjectParticipant> VW_ProjectParticipant { get; set; }

    }
}