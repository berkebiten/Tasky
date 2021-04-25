using Microsoft.EntityFrameworkCore;
using TaskyService.Models;

namespace TaskyService.DbContexts
{
    public class MailTemplateContext : DbContext
    {
        public MailTemplateContext(DbContextOptions<MailTemplateContext> options)
            : base(options)
        {
        }

        public DbSet<MailTemplate> MailTemplate { get; set; }
    }
}