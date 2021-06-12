using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TaskyService.DbContexts;
using TaskyService.Services;
using TaskyService.Models;
using System.Collections;

enum TaskStatuses
{
    ToDo = 0,
    Active = 1,
    Resolved = 2,
    Closed = 3,
}

namespace TaskyService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly TaskContext _context;
        private readonly TaskOperationContext _operationContext;
        private readonly FileContext _fileContext;
        private readonly UserContext _userContext;
        private readonly MailTemplateContext _mailTemplateContext;
        private readonly ProjectContext _projectContext;
        private readonly NotificationContext _notificationContext;

        private readonly string directory = Settings.WebDirectory;

        public TasksController(TaskContext context, TaskOperationContext operationContext, FileContext fileContext,
            UserContext userContext, MailTemplateContext mailTemplateContext, ProjectContext projectContext,
            NotificationContext notificationContext)
        {
            _context = context;
            _operationContext = operationContext;
            _fileContext = fileContext;
            _userContext = userContext;
            _mailTemplateContext = mailTemplateContext;
            _projectContext = projectContext;
            _notificationContext = notificationContext;
        }

        [HttpGet]
        [Route("GetAll")]
        public ActionResult<IEnumerable<Models.Task>> GetAllTasks()
        {
            return _context.Task.ToList();
        }

        [HttpPost]
        [Route("GetTasks")]
        public ActionResult<dynamic> GetTasks([FromHeader(Name = "Authorization")] string token, [FromBody] GetTasksBody requestBody)
        {
            var data = _context.VW_Task.ToList().Where(item => item.ProjectId == Guid.Parse(requestBody.projectId)).ToList();
            foreach (Models.VW_Task item in data)
            {
                item.StatusTitle = Enum.GetName(typeof(TaskStatuses), item.Status);
                item.AssigneeFullName = item.AssigneeFirstName + " " + item.AssigneeLastName;
                item.ReporterFullName = item.ReporterFirstName + " " + item.ReporterLastName;

            }
            return Ok(new { isSuccessful = true, data = new { tasks = data } });

        }

        [Route("GetById/{id}")]
        [HttpGet]
        public ActionResult<Models.Task> GetProject(Guid id)
        {
            var task = _context.VW_Task.Find(id);
            task.StatusTitle = Enum.GetName(typeof(TaskStatuses), task.Status);
            task.AssigneeFullName = task.AssigneeFirstName + " " + task.AssigneeLastName;
            task.ReporterFullName = task.ReporterFirstName + " " + task.ReporterLastName;
            var taskFiles = new ArrayList();

            var files = _fileContext.VW_File.ToList().Where(item => item.TableName == "Task" && item.DataId == id).ToList();
            foreach (VW_File item in files)
            {
                var taskFile = new File64();
                taskFile.Data = item.Base64;
                taskFile.Name = item.Name;
                taskFile.UserFullName = item.UserFirstName + " " + item.UserLastName;
                taskFile.date = item.CreatedDate;
                taskFiles.Add(taskFile);
            }

            task.Files = taskFiles.Cast<File64>().ToList();

            if (task == null)
            {
                return NotFound();
            }

            return Ok(new { isSuccessful = true, data = task });
        }

        [HttpPost]
        [Route("UploadFile/{id}")]
        public ActionResult UploadFile(Guid id, [FromBody] List<File64> files, [FromHeader(Name = "Authorization")] String token)
        {
            var userId = TokenService.getUserId(token);
            foreach (File64 file64 in files)
            {
                var _file = new File();
                _file.DataId = id;
                _file.Name = file64.Name;
                _file.CreatedDate = DateTime.Now;
                _file.CreatedBy = userId;
                _file.Base64 = file64.Data;
                _file.TableName = "Task";
                _fileContext.Add(_file);
            }

            try
            {
                _fileContext.SaveChanges();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessfull = true });

        }

        [HttpPut]
        [Route("Update/{id}")]
        public ActionResult PutTask(Guid id, Models.Task task)
        {
            if (id != task.Id)
            {
                return NotFound(new { isSuccessful = false, message = "Task is Not Found!" });
            }

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();


                #region send mail to assignee
                var assignee = _userContext.User.Find(task.AssigneeId);
                Hashtable ht = new Hashtable();
                ht.Add("[FIRSTNAME]", assignee.FirstName);
                ht.Add("[LINK]", directory + "task/" + task.Id);
                ht.Add("[TASKNAME]", task.Title);
                string response = new MailService(_mailTemplateContext).SendMailFromTemplate("task_updated", assignee.Email, "", ht);
                #endregion

                #region send mail to reporter
                if (task.AssigneeId != task.ReporterId)
                {
                    var reporter = _userContext.User.Find(task.ReporterId);
                    Hashtable ht2 = new Hashtable();
                    ht2.Add("[FIRSTNAME]", reporter.FirstName);
                    ht2.Add("[LINK]", directory + "task/" + task.Id);
                    ht2.Add("[TASKNAME]", task.Title);
                    string response2 = new MailService(_mailTemplateContext).SendMailFromTemplate("task_updated", reporter.Email, "", ht2);
                }
                #endregion
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }


            return Ok(new { isSuccessful = true, message = "Task is Updated Successfuly" });
        }

        [HttpPut]
        [Route("UpdateTaskStatus/{id}")]
        public ActionResult UpdateTaskStatus(Guid id, Models.Task task, [FromHeader(Name = "Authorization")] string token)
        {
            if (id != task.Id)
            {
                return NotFound(new { isSuccessful = false, message = "Task is Not Found!" });
            }

            var oldTask = _context.VW_Task.ToList().Where(item => item.Id == task.Id).FirstOrDefault();
            var assignee = _userContext.User.Find(task.AssigneeId);
            var reporter = _userContext.User.Find(task.ReporterId);
            var user = _userContext.User.Find(TokenService.getUserId(token));

            var notification = NotificationService.TASK_UPDATE;
            notification.Id = new Guid();
            notification.DataId = id;
            notification.Body = String.Format(notification.Body, user.FirstName + " " + user.LastName, task.Title, Enum.GetName(typeof(TaskStatuses), task.Status));
            notification.UserId = reporter.Id;
            notification.WebUrl = String.Format(notification.WebUrl, task.Id);
            notification.RegDate = DateTime.Now;
            _notificationContext.Add(notification);

            TaskOperation operation = new TaskOperation();
            operation.Id = new Guid();
            operation.TaskId = task.Id;
            operation.UserId = TokenService.getUserId(token);
            operation.Date = DateTime.Now;
            operation.NewStatus = task.Status;
            operation.OldStatus = oldTask.Status;
            _context.Entry(task).State = EntityState.Modified;
            _operationContext.Add(operation);

            try
            {
                _context.SaveChanges();
                _operationContext.SaveChanges();
                _notificationContext.SaveChanges();

                #region send mail to assignee
                Hashtable ht = new Hashtable();
                ht.Add("[FIRSTNAME]", assignee.FirstName);
                ht.Add("[LINK]", directory + "task/" + task.Id);
                ht.Add("[TASKNAME]", task.Title);
                string response = new MailService(_mailTemplateContext).SendMailFromTemplate("task_updated", assignee.Email, "", ht);
                #endregion


                #region send mail to reporter
                if (task.AssigneeId != task.ReporterId)
                {
                    Hashtable ht2 = new Hashtable();
                    ht2.Add("[FIRSTNAME]", reporter.FirstName);
                    ht2.Add("[LINK]", directory + "task/" + task.Id);
                    ht2.Add("[TASKNAME]", task.Title);
                    string response2 = new MailService(_mailTemplateContext).SendMailFromTemplate("task_updated", reporter.Email, "", ht2);
                }
                #endregion
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TaskExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { isSuccessful = true, message = "Task is Updated Successfuly" });
        }


        [HttpGet]
        [Route("GetTaskTimeline/{id}")]
        public ActionResult GetTaskTimeline(Guid id)
        {
            var operations = _operationContext.VW_TaskOperation.ToList().Where(operation => operation.TaskId == id).ToList();
            foreach (VW_TaskOperation operation in operations)
            {
                operation.OldStatusTitle = Enum.GetName(typeof(TaskStatuses), operation.OldStatus);
                operation.NewStatusTitle = Enum.GetName(typeof(TaskStatuses), operation.NewStatus);
                operation.UserFullName = operation.UserFirstName + " " + operation.UserLastName;
            }

            return Ok(new { data = operations });

        }

        [HttpPost]
        [Route("Insert")]
        public ActionResult<Models.Task> PostProject(Models.Task task, [FromHeader(Name = "Authorization")] String token)
        {
            task.CreatedDate = DateTime.Now.Date;
            task.Status = 0;
            var reporter_ = _userContext.User.Find(TokenService.getUserId(token));
            _context.Add(task);

            #region send notification to assignee
            var notification = NotificationService.ASSIGN_TASK;
            notification.Title = String.Format(notification.Title, reporter_.FirstName + " " + reporter_.LastName);
            notification.Body = String.Format(notification.Body, task.Title);
            notification.DataId = task.Id;
            notification.WebUrl = String.Format(notification.WebUrl, task.Id);
            notification.UserId = task.AssigneeId;
            _notificationContext.Add(notification);
            #endregion

            foreach (File64 file64 in task.Files)
            {
                var _file = new File();
                _file.DataId = task.Id;
                _file.Name = file64.Name;
                _file.CreatedDate = DateTime.Now;
                _file.CreatedBy = TokenService.getUserId(token);
                _file.Base64 = file64.Data;
                _file.TableName = "Task";
                _fileContext.Add(_file);
            }

            try
            {
                _context.SaveChanges();
                _fileContext.SaveChanges();
                _notificationContext.SaveChanges();

                string projectName = _projectContext.Project.Find(task.ProjectId).Name;

                #region send mail to assignee
                var assignee = _userContext.User.Find(task.AssigneeId);
                Hashtable ht = new Hashtable();
                ht.Add("[FIRSTNAME]", assignee.FirstName);
                ht.Add("[LINK]", directory + "task/" + task.Id);
                ht.Add("[PROJECTNAME]", projectName);
                string response = new MailService(_mailTemplateContext).SendMailFromTemplate("task_assigned", assignee.Email, "", ht);
                #endregion

                #region send mail to reporter
                if (task.AssigneeId != task.ReporterId)
                {
                    var reporter = _userContext.User.Find(task.ReporterId);
                    Hashtable ht2 = new Hashtable();
                    ht2.Add("[FIRSTNAME]", reporter.FirstName);
                    ht2.Add("[LINK]", directory + "task/" + task.Id);
                    ht2.Add("[PROJECTNAME]", projectName);
                    string response2 = new MailService(_mailTemplateContext).SendMailFromTemplate("task_created", reporter.Email, "", ht2);
                }
                #endregion
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "Task is Created Successfuly." });
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public ActionResult DeleteTask(Guid id)
        {
            var project = _context.Task.Find(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Task.Remove(project);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost]
        [Route("GetMyTasks")]
        public ActionResult<dynamic> GetMyTasks([FromHeader(Name = "Authorization")] string token)
        {
            var userId = TokenService.getUserId(token);
            var data = _context.VW_Task.ToList().Where(item => item.AssigneeId == userId).ToList();
            foreach (Models.VW_Task item in data)
            {
                item.StatusTitle = Enum.GetName(typeof(TaskStatuses), item.Status);
                item.AssigneeFullName = item.AssigneeFirstName + " " + item.AssigneeLastName;
                item.ReporterFullName = item.ReporterFirstName + " " + item.ReporterLastName;

            }
            return Ok(new { isSuccessful = true, data = new { tasks = data } });

        }

        [HttpGet]
        [Route("GetSubTasks/{taskId}")]
        public ActionResult<dynamic> GetSubTasks(Guid taskId)
        {
            var data = _context.VW_Task.ToList().Where(item => item.RootId == taskId).ToList();
            foreach (Models.VW_Task item in data)
            {
                item.StatusTitle = Enum.GetName(typeof(TaskStatuses), item.Status);
                item.AssigneeFullName = item.AssigneeFirstName + " " + item.AssigneeLastName;
                item.ReporterFullName = item.ReporterFirstName + " " + item.ReporterLastName;
            }
            return Ok(new { isSuccessful = true, data = data });

        }

        private bool TaskExists(Guid id)
        {
            return _context.Task.Any(e => e.Id == id);
        }
    }

    public class GetTasksBody
    {
        public string projectId { get; set; }
    }

}
