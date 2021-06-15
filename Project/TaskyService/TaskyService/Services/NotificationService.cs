using TaskyService.Models;

namespace TaskyService.Services
{
    public static class NotificationService
    {
        public static Notification PROJECT_INVITATION = new()
        {
            Title = "Project Invitation",
            Body = "{0} invited you to a project.",
            IsRead = false,
            WebUrl = "profile/{0}",
            MobileScreen = "PROJECT"
        };

        public static Notification TASK_UPDATE = new()
        {
            Title = "Task Status is Updated",
            Body = "{0} updated {1} task to {2}",
            IsRead = false,
            WebUrl = "task/{0}",
            MobileScreen = "TASK"
        };

        public static Notification TASK_I_UPDATE = new()
        {
            Title = "Task is Updated",
            Body = "{0} updated {1} task.",
            IsRead = false,
            WebUrl = "task/{0}",
            MobileScreen = "TASK"
        };

        public static Notification ASSIGN_TASK = new()
        {
            Title = "{0} assigned you a task.",
            Body = "{0} is assigned to you.",
            IsRead = false,
            WebUrl = "/task/{0}",
            MobileScreen = "TASK"
        };

        public static Notification WORK_LOGGED = new()
        {
            Title = "Work Logged",
            Body = "{0} logged a work under {1} task.",
            IsRead = false,
            WebUrl = "task/{0}",
            MobileScreen = "TASK"
        };

        public static Notification PARTICIPANT_LEFT = new()
        {
            Title = "Participant Left",
            Body = "{0} left {1}.",
            IsRead = false,
            WebUrl = "project/{0}",
            MobileScreen = "PROJECT"
        };

        public static Notification INVITATION_RESULT = new()
        {
            Title = "Invitation Response",
            Body = "{0} {1} your invitation to {2}.",
            IsRead = false,
            WebUrl = "project/{0}",
            MobileScreen = "PROJECT"
        };

        public static Notification PROJECT_CLOSED = new()
        {
            Title = "Project Closed",
            Body = "Project: {0} is closed.",
            IsRead = false,
            WebUrl = "project/{0}",
            MobileScreen = "PROJECT"
        };

        public static Notification PROJECT_DELETED = new()
        {
            Title = "Project Deleted",
            Body = "Project: {0} is deleted.",
            IsRead = false,
            WebUrl = "projects",
            MobileScreen = "PROJECT"
        };

        public static Notification TASK_DELETED = new()
        {
            Title = "Task Deleted",
            Body = "Task: {0} is deleted.",
            IsRead = false,
            WebUrl = "projects",
            MobileScreen = "PROJECT"
        };

        public static Notification REMOVED = new()
        {
            Title = "Removed from Project",
            Body = "{0} removed you from {1}",
            IsRead = false,
            WebUrl = "projects",
            MobileScreen = "PROJECT"
        };
    }
}
