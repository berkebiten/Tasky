using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class VW_Task
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid AssigneeId { get; set; }
        public Guid ReporterId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Project_Title { get; set; }
        public Int16 Status { get; set; }
        public Int16 Priority { get; set; }
        public string AssigneeFirstName { get; set; }
        public string AssigneeLastName { get; set; }
        public string ReporterFirstName { get; set; }
        public string ReporterLastName { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid? RootId { get; set; }
        [NotMapped]
        public string StatusTitle { get; set; }
        [NotMapped]
        public string AssigneeFullName { get; set; }
        [NotMapped]
        public string ReporterFullName { get; set; }
    }
}
