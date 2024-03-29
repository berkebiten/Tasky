﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public DateTime RegistrationDate { get; set; }
        public string FirebaseToken { get; set; }
        public bool SendEmail { get; set; }
        public bool SendNotification { get; set; }
        [NotMapped]
        public Guid? ProjectId { get; set; }
    }
}
