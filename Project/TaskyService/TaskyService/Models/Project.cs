using System;
using System.ComponentModel.DataAnnotations;

namespace TaskyService.Models
{
    public class Project
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid ProjectManagerId { get; set; }
        public bool Status { get; set; }
    }
}
