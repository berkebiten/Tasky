using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TaskyService.DbContexts;
using Newtonsoft.Json.Linq;
using TaskyService.Services;
using TaskyService.Models;
using System.Collections;

namespace TaskyService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class WorkLogsController : ControllerBase
    {
        private readonly WorkLogContext _context;
        private readonly ProjectParticipantContext _participantContext;
        private readonly TaskContext _taskContext;
        private readonly MailTemplateContext _mailTemplateContext;
        private readonly UserContext _userContext;
        private readonly NotificationContext _notificationContext;


        private readonly string directory = Settings.WebDirectory;

        public WorkLogsController(WorkLogContext context, ProjectParticipantContext participantContext, 
            MailTemplateContext mailTemplateContext, TaskContext taskContext, UserContext usercontext,
            NotificationContext notificationContext)
        {
            _context = context;
            _participantContext = participantContext;
            _mailTemplateContext = mailTemplateContext;
            _taskContext = taskContext;
            _userContext = usercontext;
            _notificationContext = notificationContext;
        }

        [HttpPost]
        [Route("GetWorkLogs")]
        public async Task<ActionResult<dynamic>> GetWorkLogs([FromBody] GetWorkLogsBody requestBody)
        {
            var data = _context.VW_WorkLog.ToList().Where(item => item.TaskId == Guid.Parse(requestBody.taskId)).ToList();
            foreach (VW_WorkLog item in data)
            {
                item.MemberFullName = item.FirstName + ' ' + item.LastName;

            }
            return Ok(new { isSuccessful = true, data = data });

        }

        [HttpPost]
        [Route("GetProjectWorkLogs")]
        public async Task<ActionResult<dynamic>> GetProjectWorkLogs([FromBody] GetWorkLogsBody requestBody)
        {
            var data = _context.VW_WorkLog.ToList().Where(item => item.ProjectId == Guid.Parse(requestBody.projectId)).ToList();
            foreach (VW_WorkLog item in data)
            {
                item.MemberFullName = item.FirstName + ' ' + item.LastName;

            }
            return Ok(new { isSuccessful = true, data = data });

        }

        [HttpGet]
        [Route("GetActivityStream")]
        public async Task<ActionResult<dynamic>> GetActivityStream([FromHeader(Name = "Authorization")] String token)
        {
            var userId = TokenService.getUserId(token);
            var projects = _participantContext.ProjectParticipant.ToList().Where(item => item.UserId == userId).ToList();
            var myProjectIds = new ArrayList();
            foreach (ProjectParticipant projectParticipant in projects)
            {
                myProjectIds.Add(projectParticipant.ProjectId);
            }
            var data = _context.VW_WorkLog.ToList().Where(item => myProjectIds.Contains(item.ProjectId)).ToList();
            foreach (VW_WorkLog item in data)
            {
                item.MemberFullName = item.FirstName + ' ' + item.LastName;

            }
            return Ok(new { isSuccessful = true, data = data });

        }

        [Route("GetById/{id}")]
        [HttpGet]
        public async Task<ActionResult<WorkLog>> GetWorkLog(Guid id)
        {
            var workLog = await _context.WorkLog.FindAsync(id);

            if (workLog == null)
            {
                return NotFound();
            }

            return workLog;
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateWorkLog(Guid id, WorkLog workLog)
        {
            if (id != workLog.Id)
            {
                return NotFound(new { isSuccessful = false, message = "Work Log is Not Found!" });
            }

            _context.Entry(workLog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkLogExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { isSuccessful = true, message = "Work Log is Updated Successfuly" });
        }

        [HttpPost]
        [Route("Insert")]
        public async Task<ActionResult<WorkLog>> InsertWorkLog(WorkLog workLog, [FromHeader(Name = "Authorization")] String token)
        {
            workLog.CreatedDate = DateTime.Now.Date;
            workLog.UserId = TokenService.getUserId(token);
            var user = _userContext.User.Find(TokenService.getUserId(token));
            var task = _taskContext.Task.Find(workLog.TaskId);
            var reporter = _userContext.User.Find(task.ReporterId);
            _context.Add(workLog);

            try
            {
                await _context.SaveChangesAsync();

                if( task.ReporterId != workLog.UserId)
                {
                    if (reporter.SendEmail)
                    {
                        #region send mail to task reporter
                        Hashtable ht = new Hashtable();
                        ht.Add("[FIRSTNAME]", reporter.FirstName);
                        ht.Add("[LINK]", directory + "task/" + task.Id);
                        ht.Add("[TASKNAME]", task.Title);
                        string response = new MailService(_mailTemplateContext).SendMailFromTemplate("worklog_entry", reporter.Email, "", ht);
                        #endregion
                    }

                    if (reporter.SendNotification)
                    {
                        #region send notification to task reporter
                        var notification = new Notification
                        {
                            DataId = workLog.Id,
                            Title = String.Format(NotificationService.WORK_LOGGED.Title),
                            Body = String.Format(NotificationService.WORK_LOGGED.Body, user.FirstName + " " + user.LastName ,task.Title),
                            UserId = task.ReporterId,
                            WebUrl = String.Format(NotificationService.WORK_LOGGED.WebUrl, task.Id),
                            MobileScreen = "TASK",
                            RegDate = DateTime.Now,
                        };
                        _notificationContext.Add(notification);
                        _notificationContext.SaveChanges();
                        #endregion
                    }
                }


            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "Work Log is Created Successfuly." });
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteWorkLog(Guid id)
        {
            var project = await _context.WorkLog.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.WorkLog.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Route("GetMyWorkLogs")]
        public async Task<ActionResult<dynamic>> GetMyWorkLogs([FromHeader(Name = "Authorization")] string token)
        {
            var userId = TokenService.getUserId(token);
            var data = _context.VW_WorkLog.ToList().Where(item => item.UserId == userId).ToList();

            return Ok(new { isSuccessful = true, data = data });

        }

        private bool WorkLogExists(Guid id)
        {
            return _context.WorkLog.Any(e => e.Id == id);
        }
    }

    public class GetWorkLogsBody
    {
        public string taskId { get; set; }
        public string projectId { get; set; }
    }

}
