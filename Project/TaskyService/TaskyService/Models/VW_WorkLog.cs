using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class VW_WorkLog
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public string ProjectName { get; set; }
        public string TaskTitle { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfileImage { get; set; }
        public string Description { get; set; }
        public string Duration { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
