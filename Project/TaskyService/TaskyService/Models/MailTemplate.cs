using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace TaskyService.Models
{
    public class MailTemplate
    {
        [Key]
        public string Code { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string To { get; set; }
        public string Cc { get; set; }
        public string Parameters { get; set; }
        public int ValidityDuration { get; set; }
    }
}
