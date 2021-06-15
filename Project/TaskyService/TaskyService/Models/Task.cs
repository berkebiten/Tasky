using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskyService.Controllers;

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
        public Int16 Status { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid? RootId { get; set; }
        [NotMapped]
        public List<File64> Files { get; set; }
    }
}
