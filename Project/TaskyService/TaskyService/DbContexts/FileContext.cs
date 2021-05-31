using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class FileContext : DbContext
    {
        public FileContext(DbContextOptions<FileContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<VW_File>(eb =>
                {
                    eb.HasNoKey();
                    eb.ToView("VW_File");
                });
        }

        public DbSet<File> File { get; set; }
        public virtual DbSet<VW_File> VW_File { get; set; }
    }
}