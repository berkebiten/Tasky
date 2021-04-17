using System;
using System.ComponentModel.DataAnnotations;

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
    }
}
