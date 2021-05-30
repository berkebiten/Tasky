using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class VW_Project
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }
        public string ProjectManagerFirstName { get; set; }
        public string ProjectManagerLastName { get; set; }
        [NotMapped]
        public List<string> Files { get; set; }
    }
}
