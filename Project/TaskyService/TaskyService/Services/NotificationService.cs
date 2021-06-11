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
            WebUrl = "/project/{0}",
            MobileScreen = "PROJECT"
        };

        public static Notification TASK_UPDATE = new()
        {
            Title = "Task is Updated",
            Body = "{0} updated {1} task to {2}",
            IsRead = false,
            WebUrl = "/task/{0}",
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
    }
}
