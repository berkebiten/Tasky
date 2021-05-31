using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskyService.Models
{
    public class VW_File
    {
        [Key]
        public Guid Id { get; set; }
        public Guid DataId { get; set; }
        public Guid CreatedBy { get; set; }
        public string Base64 { get; set; }
        public string Name { get; set; }
        public string TableName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
    }
}
