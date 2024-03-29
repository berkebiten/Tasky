﻿using System;
using System.ComponentModel.DataAnnotations;

namespace TaskyService.Models
{
    public class ProjectParticipant
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProjectId { get; set; }
        public Byte Role { get; set; }
        public bool Status { get; set; }
    }
}
