using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class VW_ProjectParticipant
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string profileImage { get; set; }
        public Byte Role { get; set; }
        [NotMapped]
        public string RoleTitle { get; set; }
        [NotMapped]
        public string FullName { get; set; }
        public bool ProjectStatus { get; set; }

    }
}
