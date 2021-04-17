using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskyService.Models;
using Microsoft.AspNetCore.Authorization;
using TaskyService.DbContexts;
using System.Collections;
using TaskyService.Services;

namespace TaskyService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectContext _context;
        private readonly ProjectParticipantContext _participantContext;
        private readonly UserContext _userContext;

        public ProjectsController(ProjectContext context, ProjectParticipantContext participantContext, UserContext userContext)
        {
            _context = context;
            _participantContext = participantContext;
            _userContext = userContext;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            return await _context.Project.ToListAsync();
        }

        [HttpPost]
        [Route("GetMyProjects")]
        public async Task<ActionResult<dynamic>> GetMyProjects([FromHeader(Name = "Authorization")] string token, [FromBody] Filter requestBody = null)
        {
            int startIndex = -1;
            int count = -1;
            if(requestBody != null)
            {
                startIndex = requestBody.startIndex;
                count = requestBody.count;
            }
            token = token.Remove(0,7);
            Guid id = Guid.Parse(TokenService.GetUserId(token).Remove(0,11));
            var myProjects = _participantContext.ProjectParticipant.ToList().Where(item => item.UserId == id).ToList();
            var myProjectIds = new ArrayList();
            foreach (ProjectParticipant projectParticipant in myProjects)
            {
                myProjectIds.Add(projectParticipant.ProjectId);
            }

            var data = _context.Project.ToList().Where(item => myProjectIds.Contains(item.Id)).ToList();
            var dataSize = data.Count();

            if (startIndex != -1 && count != -1)
            {
                data = _context.Project.Skip(startIndex)
               .Take(count).ToList().Where(item => myProjectIds.Contains(item.Id)).ToList();

            }

            return Ok(new { isSuccessful = true, data = new {projects = data, projectCount = 10 } });

        }

        [Route("GetById/{id}")]
        [HttpGet]
        public async Task<ActionResult<Project>> GetProject( Guid id)
        {
            var user = await _context.Project.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> PutProject(Guid id, Project project)
        {
            if (id != project.Id)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
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
        public async Task<ActionResult<Project>> PostProject(ProjectInsertObject project, [FromHeader(Name = "Authorization")] String token)
        {
            token = token.Remove(0, 7);
            Guid userId = Guid.Parse(TokenService.GetUserId(token).Remove(0,11));
            project.Status = true;
            project.ProjectManagerId = userId;
            ProjectParticipant manager = new ProjectParticipant();
            manager.Id = new Guid();
            manager.ProjectId = project.Id;
            manager.UserId = userId;
            _context.Add(project);
            manager.ProjectId = project.Id;
            manager.Role = 1;
            _participantContext.Add(manager);
            var userList = _userContext.User.ToList();


            foreach(Participant participantObj in project.participants){
                var participant = new ProjectParticipant();
                participant.ProjectId = project.Id;
                var participantId = userList.Where(item => item.Email == participantObj.email).FirstOrDefault().Id;
                participant.UserId = participantId;
                participant.Role = participantObj.role;
                _participantContext.Add(participant);
            }

            try
            {
                await _context.SaveChangesAsync();
                await _participantContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "Project is Created Successfuly." });
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var project = await _context.Project.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Project.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(Guid id)
        {
            return _context.Project.Any(e => e.Id == id);
        }
    }

    public class ProjectInsertObject : Project
    {
        public List<Participant> participants { get; set; }
    }

    public class Participant
    {
        public string email { get; set; }
        public Byte role { get; set; }
    }
}
