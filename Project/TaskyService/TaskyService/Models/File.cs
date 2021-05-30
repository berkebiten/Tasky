using System;
using System.ComponentModel.DataAnnotations;

namespace TaskyService.Models
{
    public class File
    {
        [Key]
        public Guid Id { get; set; }
        public Guid DataId { get; set; }
        public Guid CreatedBy { get; set; }
        public string Base64 { get; set; }
        public string Name { get; set; }
        public string TableName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
