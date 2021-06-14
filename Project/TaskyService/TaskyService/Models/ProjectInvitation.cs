using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class ProjectInvitation
    {
        [Key]
        public Guid Id { get; set; }
        public string Email { get; set; }
        public Guid ProjectId { get; set; }
        public Byte Role { get; set; }
        [NotMapped]
        public string RoleTitle { get; set; }
    }
}
