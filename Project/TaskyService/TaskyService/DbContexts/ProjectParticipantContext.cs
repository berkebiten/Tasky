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

        public DbSet<ProjectParticipant> ProjectParticipant { get; set; }
    }
}