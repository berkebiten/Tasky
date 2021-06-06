using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class ProjectInvitationContext : DbContext
    {
        public ProjectInvitationContext(DbContextOptions<ProjectInvitationContext> options)
            : base(options)
        {
        }

        public DbSet<ProjectInvitation> ProjectInvitation { get; set; }

    }
}