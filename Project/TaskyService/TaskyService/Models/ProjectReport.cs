using System;
using System.ComponentModel.DataAnnotations;
using TaskyService.Controllers;

namespace TaskyService.Models
{
    public class ProjectReport
    {
        [Key]
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; }
        public Guid ProjectManagerId { get; set; }
        public string ProjectManagerName { get; set; }
        public bool Status { get; set; }
        public string StatusTitle { get; set; }
        public int TaskCount { get; set; }
        public ParticipantReport[] ParticipantRep { get; set; }
        public TaskStatusReport[] TaskStatusReport { get; set; }
        public double TotalWorkHour { get; set; }
    }
}
