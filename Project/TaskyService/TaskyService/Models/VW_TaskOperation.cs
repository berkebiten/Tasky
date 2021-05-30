using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class VW_TaskOperation 
    {
        [Key]
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        public Int16 OldStatus { get; set; }
        public Int16 NewStatus { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserProfileImage { get; set; }
        [NotMapped]
        public string OldStatusTitle { get; set; }
        [NotMapped]
        public string NewStatusTitle { get; set; }
        [NotMapped]
        public string UserFullName { get; set; }
    }
}
