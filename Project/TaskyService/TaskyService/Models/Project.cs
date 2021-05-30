using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskyService.Controllers;

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
        [NotMapped]
        public List<File64> Files { get; set; }
    }
}
