using System;
using System.ComponentModel.DataAnnotations;

namespace TaskyService.Models
{
    public class TaskOperation
    {
        [Key]
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public Int16 OldStatus { get; set; }
        public Int16 NewStatus { get; set; }
    }
}
