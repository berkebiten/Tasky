using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class VW_RecentProjects
    {
        [Key]
        public Guid UserId { get; set; }
        public Guid ProjectId { get; set; }
        public string ProjectName { get; set; }
    }
}
