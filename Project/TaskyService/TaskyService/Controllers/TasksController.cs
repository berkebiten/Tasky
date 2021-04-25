using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using TaskyService.DbContexts;
using Newtonsoft.Json.Linq;

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

            }
            return Ok(new { isSuccessful = true, data = new { tasks = data} });

        }

        [Route("GetById/{id}")]
        [HttpGet]
        public async Task<ActionResult<Models.Task>> GetProject(Guid id)
        {
            var task = await _context.Task.FindAsync(id);

            if (task == null)
            {
                return NotFound();
            }

            return task;
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> PutProject(Guid id, Models.Task task)
        {
            if (id != task.Id)
            {
                return BadRequest();
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

            return NoContent();
        }

        [HttpPost]
        [Route("Insert")]
        public async Task<ActionResult<Models.Task>> PostProject(Models.Task task, [FromHeader(Name = "Authorization")] String token)
        {

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
