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

        public WorkLogsController(WorkLogContext context, ProjectParticipantContext participantContext)
        {
            _context = context;
            _participantContext = participantContext;
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

            _context.Add(workLog);

            try
            {
                await _context.SaveChangesAsync();
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
