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

        public DbSet<WorkLog> WorkLog { get; set; }
    }
}