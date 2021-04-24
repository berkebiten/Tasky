using System;
using System.ComponentModel.DataAnnotations;
namespace TaskyService.Models
{
    public class Task
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid AssigneeId { get; set; }
        public Guid ReporterId { get; set; }
        public Int16 Priority { get; set; }
        public Int16 Status { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
