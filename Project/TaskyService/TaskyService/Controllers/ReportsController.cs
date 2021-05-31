using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskyService.DbContexts;
using TaskyService.Models;

namespace TaskyService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {

        private readonly ProjectContext _projectContext;
        private readonly ProjectParticipantContext _participantContext;
        private readonly UserContext _userContext;
        private readonly TaskContext _taskContext;
        private readonly WorkLogContext _workLogContext;

        public ReportsController(ProjectContext context, TaskContext taskContext,WorkLogContext workLogContext , ProjectParticipantContext participantContext, UserContext userContext)
        {
            _projectContext = context;
            _participantContext = participantContext;
            _userContext = userContext;
            _taskContext = taskContext;
            _workLogContext = workLogContext;
        }

        [Route("GetProjectReport/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetProjectReport(Guid id)
        {
            ProjectReport report = new ProjectReport();
            var project = _projectContext.VW_Project.ToList().Where(item => item.Id == id).FirstOrDefault();
            report.ProjectId = project.Id;
            report.ProjectName = project.Name;
            report.ProjectManagerName = project.ProjectManagerFirstName + " " + project.ProjectManagerLastName;
            report.Status = project.Status;
            report.TaskCount = GetTaskCount(project.Id);
            report.ParticipantRep = GetParticipantReport(project.Id);
            report.TaskStatusReport = GetTaskStatusReport(project.Id);
            report.TotalWorkHour = GetTotalWorkHour(project.Id);
            report.WorkHoursReport = GetWorkHours(project.Id);
            return Ok(new { isSuccessfull = true, data = report });
        }

        private int GetTaskCount (Guid id)
        {
            return _taskContext.VW_Task.ToList().Where(task => task.ProjectId == id).ToList().Count();
        }

        private ParticipantReport[] GetParticipantReport (Guid id)
        {
            var participants = _participantContext.VW_ProjectParticipant.ToList().Where(item => item.ProjectId == id);
            ParticipantReport[] participantReport = new ParticipantReport[3];
            ParticipantReport manager = new ParticipantReport();
            manager.Count = 0;
            manager.Role = "Project Manager";
            manager.Fill = "#f16413";
            ParticipantReport watcher = new ParticipantReport();
            watcher.Count = 0;
            watcher.Role = "Watcher";
            watcher.Fill = "#464a50";
            ParticipantReport member = new ParticipantReport();
            member.Count = 0;
            member.Role = "Team Member";
            member.Fill = "#4594b4";
            foreach (VW_ProjectParticipant participant in participants)
            {
                if (participant.Role == (Byte) RoleTitles.ProjectManager)
                {
                    manager.Count = manager.Count + 1;

                }else if (participant.Role == (Byte)RoleTitles.TeamMember)
                {
                    member.Count = member.Count + 1; 
                }
                else
                {
                    watcher.Count = watcher.Count + 1;
                }
                
            }
            participantReport[0] = manager;
            participantReport[1] = watcher;
            participantReport[2] = member;
            return participantReport;
        }

        private TaskStatusReport[] GetTaskStatusReport (Guid id)
        {
            var tasks = _taskContext.VW_Task.ToList().Where(item => item.ProjectId == id);
            TaskStatusReport[] taskReport = new TaskStatusReport[4];


            foreach( TaskStatuses status in Enum.GetValues(typeof(TaskStatuses)))
            {
                TaskStatusReport newStatus = new TaskStatusReport();
                newStatus.Count = 0;
                switch (status)
                {
                    case 0:
                        newStatus.Status = "To-Do";
                        taskReport[(int)status] = newStatus;
                        break;
                    case (TaskStatuses)1:
                        newStatus.Status = "Active";
                        taskReport[(int)status] = newStatus;
                        break;
                    case (TaskStatuses)2:
                        newStatus.Status = "Resolved";
                        taskReport[(int)status] = newStatus;
                        break;
                    default:
                        newStatus.Status = "Closed";
                        taskReport[(int)status] = newStatus;
                        break;
                }
            }

            foreach(VW_Task task in tasks)
            {
                taskReport[task.Status].Count = taskReport[task.Status].Count + 1;

            }

            return taskReport;

        }

        private double GetTotalWorkHour (Guid id)
        {
            double workHour = 0;
            var workLogs = _workLogContext.VW_WorkLog.ToList().Where(item => item.ProjectId == id);
            foreach(VW_WorkLog workLog in workLogs)
            {
                if (workLog.Duration.Contains("h"))
                {
                    workHour = workHour + Double.Parse(workLog.Duration.Replace("h", ""));
                }
                else if (workLog.Duration.Contains("m"))
                {
                    workHour = workHour + (Double.Parse(workLog.Duration.Replace("m", "")) / 60);
                }
                else
                {
                    workHour = workHour + (Double.Parse(workLog.Duration.Replace("d", "")) * 24);
                }
            }

            return Double.Parse(String.Format("{0:0.00}", workHour));      
        }

        private WorkHoursReport[] GetWorkHours (Guid id)
        {
            double workHour = 0;
            var participants = _participantContext.VW_ProjectParticipant.ToList().Where(item => item.ProjectId == id && item.Role != 2).ToList();
            WorkHoursReport[] workHoursReports = new WorkHoursReport[participants.Count];
            int index = 0;
            foreach (VW_ProjectParticipant participant in participants)
            {
                workHour = 0;
                WorkHoursReport newWHReport = new WorkHoursReport();
                newWHReport.FullName = participant.FirstName + " " + participant.LastName;

                var participantWorkLogs = _workLogContext.VW_WorkLog.ToList().Where(item => item.ProjectId == id && item.UserId == participant.UserId);

                foreach (VW_WorkLog workLog in participantWorkLogs)
                {
                    if (workLog.Duration.Contains("h"))
                    {
                        workHour += Double.Parse(workLog.Duration.Replace("h", ""));
                    }
                    else if (workLog.Duration.Contains("m"))
                    {
                        workHour += (Double.Parse(workLog.Duration.Replace("m", "")) / 60);
                    }
                    else
                    {
                        workHour += (Double.Parse(workLog.Duration.Replace("d", "")) * 24);
                    }
                }
                newWHReport.WorkHour = workHour;
                workHoursReports[index] = newWHReport;
                index++;
            }
            return workHoursReports;
        }
    }

    public class ParticipantReport
    {
        public string Role { get; set; }
        public int Count { get; set; }
        public string Fill { get; set; }
    }

    public class TaskStatusReport
    {
        public string Status { get; set; }
        public int Count { get; set; }
    }

    public class WorkHoursReport
    {
        public string FullName { get; set; }
        public double WorkHour { get; set; }
    }
}
