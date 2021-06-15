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

enum RoleTitles
{
    TeamMember = 0,
    ProjectManager = 1,
    Watcher = 2,
}

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
        private readonly FileContext _fileContext;
        private readonly ProjectInvitationContext _invitationContext;
        private readonly MailTemplateContext _mailTemplateContext;
        private readonly NotificationContext _notificationContext;

        private readonly string directory = Settings.WebDirectory;

        public ProjectsController(ProjectContext context, ProjectInvitationContext invitationContext,
            FileContext fileContext, NotificationContext notificationContext, ProjectParticipantContext participantContext,
            UserContext userContext, MailTemplateContext mailTemplateContext)
        {
            _context = context;
            _participantContext = participantContext;
            _userContext = userContext;
            _fileContext = fileContext;
            _invitationContext = invitationContext;
            _mailTemplateContext = mailTemplateContext;
            _notificationContext = notificationContext;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            return await _context.Project.ToListAsync();
        }

        [HttpPost]
        [Route("GetMyProjects/{showClosed}")]
        public async Task<ActionResult<dynamic>> GetMyProjects(bool showClosed, [FromHeader(Name = "Authorization")] string token, [FromBody] Filter requestBody = null)
        {

            Guid id = TokenService.getUserId(token);
            var myProjects = _participantContext.ProjectParticipant.ToList().Where(item => item.UserId == id && item.Status == true).ToList();
            var myProjectIds = new ArrayList();
            foreach (ProjectParticipant projectParticipant in myProjects)
            {
                myProjectIds.Add(projectParticipant.ProjectId);
            }

            var data = _context.VW_Project.ToList().Where(item => myProjectIds.Contains(item.Id)).ToList();
            var dataSize = data.Count();
            data = _context.VW_Project.ToList().Where(item => myProjectIds.Contains(item.Id)).ToList();
            if (showClosed == false)
            {
                data = data.Where(item => item.Status == true).ToList();
            }

            return Ok(new { isSuccessful = true, data = new { projects = data, projectCount = dataSize } });

        }

        [Route("GetById/{id}")]
        [HttpGet]
        public async Task<ActionResult<Project>> GetProject(Guid id)
        {
            var project = _context.VW_Project.ToList().Where(item => item.Id == id).FirstOrDefault();
            var projectFiles = new ArrayList();
            var files = _fileContext.VW_File.ToList().Where(item => item.TableName == "Project" && item.DataId == id).ToList();
            foreach (VW_File item in files)
            {
                var projectFile = new File64();
                projectFile.Data = item.Base64;
                projectFile.Name = item.Name;
                projectFile.UserFullName = item.UserFirstName + " " + item.UserLastName;
                projectFile.date = item.CreatedDate;
                projectFiles.Add(projectFile);
            }

            project.Files = projectFiles.Cast<File64>().ToList();
            if (project == null)
            {
                return NotFound();
            }

            return Ok(new { isSuccessful = true, data = project });
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

            return Ok(new { isSuccessfull = true });
        }

        [HttpPut]
        [Route("UpdateProjectStatus/{id}")]
        public async Task<IActionResult> UpdateProjectStatus(Guid id, Project project)
        {
            if (id != project.Id)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;

            try
            {
                var participants = _participantContext.ProjectParticipant.ToList().Where(item => item.ProjectId == project.Id && item.Role != 1 && item.Status == true);

                foreach (var part in participants)
                {
                    var user = _userContext.User.Find(part.UserId);

                    if (user.SendEmail)
                    {
                        #region send email to participant
                        Hashtable ht = new Hashtable();
                        ht.Add("[FIRSTNAME]", user.FirstName);
                        ht.Add("[PROJECTNAME]", project.Name);
                        string response = new MailService(_mailTemplateContext).SendMailFromTemplate("project_closed", user.Email, "", ht);
                        #endregion
                    }

                    if (user.SendNotification)
                    {
                        #region send notification to participant
                        var notification = new Notification
                        {
                            DataId = project.Id,
                            Title = String.Format(NotificationService.PROJECT_CLOSED.Title),
                            Body = String.Format(NotificationService.PROJECT_CLOSED.Body, project.Name),
                            UserId = user.Id,
                            WebUrl = String.Format(NotificationService.PROJECT_CLOSED.WebUrl, project.Id),
                            MobileScreen = "PROJECT",
                            RegDate = DateTime.Now,
                        };

                        _notificationContext.Add(notification);
                        #endregion
                    }
                }

                await _context.SaveChangesAsync();
                _notificationContext.SaveChanges();

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

            return Ok(new { isSuccessfull = true });
        }



        [HttpPost]
        [Route("Insert")]
        public async Task<ActionResult<Project>> PostProject(ProjectInsertObject project, [FromHeader(Name = "Authorization")] String token)
        {
            Guid userId = TokenService.getUserId(token);
            project.Status = true;
            project.ProjectManagerId = userId;
            ProjectParticipant manager = new ProjectParticipant();
            manager.Id = new Guid();
            manager.ProjectId = project.Id;
            manager.UserId = userId;
            _context.Add(project);
            manager.ProjectId = project.Id;
            manager.Role = 1;
            manager.Status = true;
            _participantContext.Add(manager);
            var userList = _userContext.User.ToList();


            foreach (Participant participantObj in project.participants)
            {
                var participant = new ProjectParticipant();
                participant.ProjectId = project.Id;
                participant.Status = false;
                var participantId = userList.Where(item => item.Email == participantObj.email).FirstOrDefault();
                var managerUser = _userContext.User.Find(manager.UserId);
                if (participantId == null)
                {
                    #region send invite email
                    Hashtable ht = new Hashtable();
                    ht.Add("[FIRSTNAME]", "");
                    ht.Add("[PROJECTMANAGER]", managerUser.FirstName + " " + managerUser.LastName);
                    ht.Add("[LINK]", directory + "sign-up/" + project.Id);
                    string response = new MailService(_mailTemplateContext).SendMailFromTemplate("invite_to_project", participantObj.email, "", ht);
                    #endregion

                    var invitation = new ProjectInvitation();
                    invitation.Email = participantObj.email;
                    invitation.Role = participantObj.role;
                    invitation.ProjectId = project.Id;
                    _invitationContext.Add(invitation);
                    continue;
                }

                participant.UserId = participantId.Id;
                participant.Role = participantObj.role;

                if (!ParticipantExists(participantId.Id, project.Id))
                {
                    #region send invite email
                    Hashtable ht = new Hashtable();
                    ht.Add("[FIRSTNAME]", participantId.FirstName + " " + participantId.LastName);
                    ht.Add("[PROJECTMANAGER]", managerUser.FirstName + " " + managerUser.LastName);
                    ht.Add("[LINK]", directory + "profile/" + participant.UserId);
                    string response = new MailService(_mailTemplateContext).SendMailFromTemplate("invite_to_project", participantObj.email, "", ht);
                    #endregion
                    _participantContext.Add(participant);
                }
            }

            foreach (File64 file64 in project.Files)
            {
                var _file = new File();
                _file.DataId = project.Id;
                _file.Name = file64.Name;
                _file.CreatedDate = DateTime.Now;
                _file.CreatedBy = userId;
                _file.Base64 = file64.Data;
                _file.TableName = "Project";
                _fileContext.Add(_file);
            }


            try
            {
                await _context.SaveChangesAsync();
                await _participantContext.SaveChangesAsync();
                await _fileContext.SaveChangesAsync();
                await _invitationContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "Project is Created Successfuly." });
        }

        [HttpPost]
        [Route("InviteParticipant/{id}")]
        public async Task<IActionResult> InviteParticipant(Guid id, List<Participant> participants, [FromHeader(Name = "Authorization")] String token)
        {
            var userList = _userContext.User.ToList();
            var project = _context.VW_Project.ToList().Where(item => item.Id == id).FirstOrDefault();
            foreach (Participant participantObj in participants)
            {
                var participant = new ProjectParticipant();
                participant.ProjectId = id;
                participant.Status = false;
                var managerUser = _userContext.User.Find(TokenService.getUserId(token));
                var participantId = userList.Where(item => item.Email == participantObj.email).FirstOrDefault();
                if (participantId == null)
                {
                    #region send invite email
                    Hashtable ht = new Hashtable();
                    ht.Add("[FIRSTNAME]", "");
                    ht.Add("[PROJECTMANAGER]", managerUser.FirstName + " " + managerUser.LastName);
                    ht.Add("[LINK]", directory + "sign-up/" + id);
                    string response = new MailService(_mailTemplateContext).SendMailFromTemplate("invite_to_project", participantObj.email, "", ht);
                    #endregion

                    var invitation = new ProjectInvitation();
                    invitation.Email = participantObj.email;
                    invitation.Role = participantObj.role;
                    invitation.ProjectId = id;
                    _invitationContext.Add(invitation);
                    continue;
                }
                participant.UserId = participantId.Id;
                participant.Role = participantObj.role;
                if (!ParticipantExists(participantId.Id, id))
                {
                    var notification = new Notification
                    {
                        DataId = project.Id,
                        Title = NotificationService.PROJECT_INVITATION.Title,
                        Body = String.Format(NotificationService.PROJECT_INVITATION.Body, project.ProjectManagerFirstName + " " + project.ProjectManagerLastName),
                        UserId = participant.UserId,
                        WebUrl = String.Format(NotificationService.PROJECT_INVITATION.WebUrl, participantId.Id),
                        MobileScreen = null,
                        RegDate = DateTime.Now,

                    };
                    #region send invite email
                    Hashtable ht = new Hashtable();
                    ht.Add("[FIRSTNAME]", participantId.FirstName + " " + participantId.LastName);
                    ht.Add("[PROJECTMANAGER]", managerUser.FirstName + " " + managerUser.LastName);
                    ht.Add("[LINK]", directory + "profile/" + participant.UserId);
                    string response = new MailService(_mailTemplateContext).SendMailFromTemplate("invite_to_project", participantObj.email, "", ht);
                    #endregion
                    _notificationContext.Add(notification);
                    _participantContext.Add(participant);
                }
                else
                {
                    return Ok(new { isSuccessful = false, message = "User already exists." });
                }
            }

            try
            {
                await _participantContext.SaveChangesAsync();
                await _invitationContext.SaveChangesAsync();
                await _notificationContext.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "User Invited to Project." });

        }

        [HttpDelete]
        [Route("DeleteProject/{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var project = await _context.Project.FindAsync(id);

            if (project == null)
            {
                return NotFound();
            }

            try
            {
                var participants = _participantContext.ProjectParticipant.ToList().Where(item => item.ProjectId == id && item.Status == true);
                var projectOwner = _userContext.User.Find(project.ProjectManagerId);
                foreach (var part in participants)
                {
                    var user = _userContext.User.Find(part.UserId);

                    if (user != null && user.SendEmail)
                    {
                        #region send mail to removed user
                        Hashtable ht = new Hashtable();
                        ht.Add("[FIRSTNAME]", user.FirstName);
                        ht.Add("[PROJECTNAME]", project.Name);
                        string response = new MailService(_mailTemplateContext).SendMailFromTemplate("project_closed", user.Email, "", ht);
                        #endregion
                    }

                    if (user != null && user.SendNotification)
                    {
                        #region send notification to removed user
                        var notification = new Notification
                        {
                            DataId = projectOwner.Id,
                            Title = String.Format(NotificationService.PROJECT_DELETED.Title),
                            Body = String.Format(NotificationService.PROJECT_DELETED.Body, project.Name),
                            UserId = user.Id,
                            WebUrl = String.Format(NotificationService.PROJECT_DELETED.WebUrl, "projects"),
                            MobileScreen = "PROJECT",
                            RegDate = DateTime.Now,
                        };

                        _notificationContext.Add(notification);
                        _notificationContext.SaveChanges();
                        #endregion
                    }
                }

                _context.Remove(project);
                await _context.SaveChangesAsync();

            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "Project Deleted." });
        }

        [HttpDelete]
        [Route("RemoveParticipant/{participantId}")]
        public IActionResult InviteParticipant(Guid participantId)
        {
            var participant = _participantContext.ProjectParticipant.Find(participantId);
            if (participant == null)
            {
                return NotFound();
            }

            _participantContext.Remove(participant);

            try
            {
                _participantContext.SaveChanges();

                var user = _userContext.User.Find(participant.UserId);
                var project = _context.Project.Find(participant.ProjectId);
                var projectOwner = _userContext.User.Find(project.ProjectManagerId);

                if (user != null && user.SendEmail)
                {
                    #region send mail to removed user
                    Hashtable ht = new Hashtable();
                    ht.Add("[FIRSTNAME]", user.FirstName);
                    ht.Add("[PROJECTNAME]", project.Name);
                    ht.Add("[PROJECTOWNERNAME]", projectOwner.FirstName + " " + projectOwner.LastName);
                    string response = new MailService(_mailTemplateContext).SendMailFromTemplate("removed_from_project", user.Email, "", ht);
                    #endregion
                }

                if (user != null && user.SendNotification)
                {
                    #region send notification to removed user
                    var notification = new Notification
                    {
                        DataId = projectOwner.Id,
                        Title = String.Format(NotificationService.REMOVED.Title),
                        Body = String.Format(NotificationService.REMOVED.Body, projectOwner.FirstName + " " + projectOwner.LastName, project.Name),
                        UserId = user.Id,
                        WebUrl = String.Format(NotificationService.REMOVED.WebUrl, "projects"),
                        MobileScreen = "PROJECT",
                        RegDate = DateTime.Now,
                    };

                    _notificationContext.Add(notification);
                    _notificationContext.SaveChanges();
                    #endregion
                }

            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "User Removed From Project." });
        }

        [HttpDelete]
        [Route("LeaveProject/{projectId}/{userId}")]
        public IActionResult LeaveProject(Guid projectId, Guid userId)
        {
            var participant = _participantContext.ProjectParticipant.ToList().Where(
                item => item.UserId == userId && item.ProjectId == projectId &&
                item.Status == true
                ).FirstOrDefault();
            if (participant == null)
            {
                return NotFound();
            }

            _participantContext.Remove(participant);

            try
            {
                _participantContext.SaveChanges();

                var user = _userContext.User.Find(participant.UserId);
                var project = _context.Project.Find(participant.ProjectId);
                var projectOwner = _userContext.User.Find(project.ProjectManagerId);

                if (projectOwner.SendEmail)
                {
                    #region send mail to project owner
                    Hashtable ht2 = new Hashtable();
                    ht2.Add("[FIRSTNAME]", projectOwner.FirstName);
                    ht2.Add("[PARTICIPANTNAME]", user.FirstName + " " + user.LastName);
                    ht2.Add("[PROJECTNAME]", project.Name);
                    string response2 = new MailService(_mailTemplateContext).SendMailFromTemplate("participant_left", projectOwner.Email, "", ht2);
                    #endregion
                }
                if (projectOwner.SendNotification)
                {
                    #region send notification to project owner
                    var notification = new Notification
                    {
                        DataId = project.Id,
                        Title = String.Format(NotificationService.PARTICIPANT_LEFT.Title),
                        Body = String.Format(NotificationService.PARTICIPANT_LEFT.Body, user.FirstName + " " + user.LastName, project.Name),
                        UserId = projectOwner.Id,
                        WebUrl = String.Format(NotificationService.PARTICIPANT_LEFT.WebUrl, project.Id),
                        MobileScreen = "PROJECT",
                        RegDate = DateTime.Now,

                    };
                    _notificationContext.Add(notification);
                    _notificationContext.SaveChanges();
                    #endregion
                }
            }
            catch (DbUpdateException)
            {
                throw;
            }

            return Ok(new { isSuccessful = true, message = "You left the project." });
        }


        [HttpPost]
        [Route("UploadFile/{id}")]
        public IActionResult UploadFile(Guid id, [FromBody] List<File64> files, [FromHeader(Name = "Authorization")] String token)
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
                _file.TableName = "Project";
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


        [HttpPost]
        [Route("Accept/{id}")]
        public IActionResult AcceptInvitation(Guid id)
        {
            var participant = _participantContext.ProjectParticipant.Find(id);
            participant.Status = true;
            _participantContext.Entry(participant).State = EntityState.Modified;
            _participantContext.SaveChanges();

            var user = _userContext.User.Find(participant.UserId);
            var project = _context.Project.Find(participant.ProjectId);
            var projectOwner = _userContext.User.Find(project.ProjectManagerId);

            if (projectOwner.SendEmail)
            {
                #region send email to project owner
                Hashtable ht = new Hashtable();
                ht.Add("[FIRSTNAME]", projectOwner.FirstName);
                ht.Add("[RESPONSERFIRSTNAME]", user.FirstName);
                ht.Add("[AORD]", "accepted");
                ht.Add("[LINK]", directory + "project/" + project.Id);
                ht.Add("[PROJECTNAME]", project.Name);
                string response2 = new MailService(_mailTemplateContext).SendMailFromTemplate("invitation_respond", projectOwner.Email, "", ht);
                #endregion
            }

            if (projectOwner.SendNotification)
            {
                #region send notification to project owner
                var notification = new Notification
                {
                    DataId = project.Id,
                    Title = String.Format(NotificationService.INVITATION_RESULT.Title),
                    Body = String.Format(NotificationService.INVITATION_RESULT.Body, user.FirstName + " " + user.LastName, "accepted", project.Name),
                    UserId = projectOwner.Id,
                    WebUrl = String.Format(NotificationService.INVITATION_RESULT.WebUrl, project.Id),
                    MobileScreen = "PROJECT",
                    RegDate = DateTime.Now,
                };

                _notificationContext.Add(notification);
                _notificationContext.SaveChanges();
                #endregion
            }

            return Ok(new { isSuccessfull = true });
        }

        [HttpDelete]
        [Route("Decline/{id}")]
        public IActionResult DeclineInvitation(Guid id)
        {
            var participant = _participantContext.ProjectParticipant.Find(id);

            var user = _userContext.User.Find(participant.UserId);
            var project = _context.Project.Find(participant.ProjectId);
            var projectOwner = _userContext.User.Find(project.ProjectManagerId);

            if (projectOwner.SendEmail)
            {
                #region send email to project owner
                Hashtable ht = new Hashtable();
                ht.Add("[FIRSTNAME]", projectOwner.FirstName);
                ht.Add("[RESPONSERFIRSTNAME]", user.FirstName);
                ht.Add("[AORD]", "declined");
                ht.Add("[LINK]", directory + "project/" + project.Id);
                ht.Add("[PROJECTNAME]", project.Name);
                string response2 = new MailService(_mailTemplateContext).SendMailFromTemplate("invitation_respond", projectOwner.Email, "", ht);
                #endregion
            }

            if (projectOwner.SendNotification)
            {
                #region send notification to project owner
                var notification = new Notification
                {
                    DataId = project.Id,
                    Title = String.Format(NotificationService.INVITATION_RESULT.Title),
                    Body = String.Format(NotificationService.INVITATION_RESULT.Body, user.FirstName + " " + user.LastName, "declined", project.Name),
                    UserId = projectOwner.Id,
                    WebUrl = String.Format(NotificationService.INVITATION_RESULT.WebUrl, project.Id),
                    MobileScreen = "PROJECT",
                    RegDate = DateTime.Now,
                };

                _notificationContext.Add(notification);
                _notificationContext.SaveChanges();
                #endregion
            }


            _participantContext.ProjectParticipant.Remove(participant);
            _participantContext.SaveChanges();


            return Ok(new { isSuccessfull = true });
        }

        [HttpGet]
        [Route("GetProjectParticipants/{id}")]
        public async Task<IActionResult> GetProjectParticipants(Guid id)
        {
            var participants = _participantContext.VW_ProjectParticipant.ToList().Where(item => item.ProjectId == id).ToList();
            var invitations = _invitationContext.ProjectInvitation.ToList().Where(item => item.ProjectId == id).ToList();
            foreach (VW_ProjectParticipant item in participants)
            {
                item.RoleTitle = Enum.GetName(typeof(RoleTitles), item.Role);
                item.FullName = item.FirstName + " " + item.LastName;
            }

            foreach (ProjectInvitation item in invitations)
            {
                item.RoleTitle = Enum.GetName(typeof(RoleTitles), item.Role);
            }

            return Ok(new { isSuccessful = true, data = new { Participants = participants, Invitations = invitations } });
        }

        private bool ProjectExists(Guid id)
        {
            return _context.Project.Any(e => e.Id == id);
        }

        private bool ParticipantExists(Guid userId, Guid projectId)
        {
            return _participantContext.ProjectParticipant.Any(e => e.UserId == userId && e.ProjectId == projectId);
        }

        [HttpGet]
        [Route("GetRole/{projectId}/{userId}")]
        public IActionResult GetRole(Guid projectId, Guid userId)
        {
            var participant = _participantContext.VW_ProjectParticipant.ToList().Where(
                participant => participant.UserId == userId && participant.ProjectId == projectId &&
                participant.Status == true
                ).FirstOrDefault();
            if (participant == null)
            {
                return Ok(new { data = participant });
            }
            return Ok(new { data = Enum.GetName(typeof(RoleTitles), participant.Role) });
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

    public class File64
    {
        public string Name { get; set; }
        public string Data { get; set; }
        public string UserFullName { get; set; }
        public DateTime date { get; set; }
    }

    public class Utils
    {

    }
}
