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

        public TasksController(TaskContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult<IEnumerable<Models.Task>>> GetAllTasks()
        {
            return await _context.Task.ToListAsync();
        }

        [HttpPost]
        [Route("GetTasks")]
        public async Task<ActionResult<dynamic>> GetTasks([FromHeader(Name = "Authorization")] string token, [FromBody] GetTasksBody requestBody)
        {
            var data = _context.VW_Task.ToList().Where(item => item.ProjectId == Guid.Parse(requestBody.projectId)).ToList();
            foreach (Models.VW_Task item in data)
            {
                item.StatusTitle = Enum.GetName(typeof(TaskStatuses), item.Status);
                item.AssigneeFullName = item.AssigneeFirstName + " " + item.AssigneeLastName;
                item.ReporterFullName = item.ReporterFirstName + " " + item.ReporterLastName;

            }
            return Ok(new { isSuccessful = true, data = new { tasks = data} });

        }

        [Route("GetById/{id}")]
        [HttpGet]
        public async Task<ActionResult<Models.Task>> GetProject(Guid id)
        {
            var task = await _context.VW_Task.FindAsync(id);
            task.StatusTitle = Enum.GetName(typeof(TaskStatuses), task.Status);
            task.AssigneeFullName = task.AssigneeFirstName + " " + task.AssigneeLastName;
            task.ReporterFullName = task.ReporterFirstName + " " + task.ReporterLastName;

            if (task == null)
            {
                return NotFound();
            }

            return Ok(new { isSuccessful = true, data = task });
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> PutProject(Guid id, Models.Task task)
        {
            if (id != task.Id)
            {
                return NotFound(new { isSuccessful = false, message = "Task is Not Found!" });
            }

            _context.Entry(task).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
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

        [HttpPost]
        [Route("Insert")]
        public async Task<ActionResult<Models.Task>> PostProject(Models.Task task, [FromHeader(Name = "Authorization")] String token)
        {
            task.CreatedDate = DateTime.Now.Date;
            task.Status = 0;

            _context.Add(task);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "Task is Created Successfuly." });
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var project = await _context.Task.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Task.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        [Route("GetMyTasks")]
        public async Task<ActionResult<dynamic>> GetMyTasks([FromHeader(Name = "Authorization")] string token)
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
        public async Task<ActionResult<dynamic>> GetSubTasks(Guid taskId)
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
