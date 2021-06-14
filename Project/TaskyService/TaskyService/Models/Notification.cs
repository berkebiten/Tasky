using System;
using System.ComponentModel.DataAnnotations;

namespace TaskyService.Models
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid DataId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string WebUrl { get; set; }
        public string? MobileScreen { get; set; }
        public bool IsRead { get; set; }
        public DateTime RegDate { get; set; }
    }
}
