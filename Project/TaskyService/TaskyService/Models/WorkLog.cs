using System;
using System.ComponentModel.DataAnnotations;
namespace TaskyService.Models
{
    public class WorkLog
    {
        [Key]
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public string Description { get; set; }
        public string Duration { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
