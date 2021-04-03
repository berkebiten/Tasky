using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace TaskyService.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string ProfileImage { get; set; }
        public bool ActivationStatus { get; set; }
        public bool Status { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string FirebaseToken { get; set; }
    }
}
