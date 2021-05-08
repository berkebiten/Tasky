using System;
using System.ComponentModel.DataAnnotations;

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
    }
}
