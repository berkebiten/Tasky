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

        public DbSet<File> File { get; set; }
    }
}