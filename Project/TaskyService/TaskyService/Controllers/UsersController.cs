using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskyService.Models;
using TaskyService.DbContexts;
using TaskyService.Services;
using Microsoft.AspNetCore.Authorization;
using BC = BCrypt.Net.BCrypt;
using System.Collections;


namespace TaskyService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserContext _context;
        private readonly MailTemplateContext _mailTemplateContext;
        private readonly ProjectParticipantContext _projectContext;
        private readonly TaskContext _taskContext;
        private readonly WorkLogContext _workLogContext;
        private readonly ProjectContext _projectOnlyContext;
        private readonly NotificationContext _notificationContext;

        private readonly string directory = Settings.WebDirectory;

        public UsersController(UserContext context, MailTemplateContext mailTemplateContext, ProjectParticipantContext projectContext,
                                TaskContext taskContext, WorkLogContext workLogContext, ProjectContext projectOnlyContext,
                                NotificationContext notificationContext)
        {
            _context = context;
            _mailTemplateContext = mailTemplateContext;
            _projectContext = projectContext;
            _taskContext = taskContext;
            _workLogContext = workLogContext;
            _projectOnlyContext = projectOnlyContext;
            _notificationContext = notificationContext;
        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Authenticate([FromBody] Login model)
        {
            var user = _context.User.ToList().Where(x => x.Email == model.Email && BC.Verify(model.Password, x.Password)).FirstOrDefault();

            if (user == null)
                return NotFound(new { isSuccessful = false, message = "Email or Password is Invalid" });

            if (user.ActivationStatus == false)
                return NotFound(new { isSuccessful = false, message = "Please Verify Your Email" });

            if(model.FcmToken != null)
            {
                user.FirebaseToken = model.FcmToken;
                _context.User.Update(user);

                try
                {
                    _context.SaveChanges();

                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }

            var token = TokenService.CreateToken(user);
            user.Password = "";
            return Ok(new
            {
                isSuccessful = true,
                message = "Login is successful",
                data = new { user = user, token = token }
            });
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.User.ToListAsync();
        }

        [Route("GetById/{id}")]
        [HttpGet]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> PutUser(Guid id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { isSuccessful = true, message = "Updated." });
        }

        [HttpPost]
        [Route("Register")]
        [AllowAnonymous]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.ActivationStatus = false;
            user.Status = true;
            user.RegistrationDate = DateTime.Now.Date;
            user.Password = BC.HashPassword(user.Password);
            _context.User.Add(user);
            try
            {
                await _context.SaveChangesAsync();

                #region send activation email
                Hashtable ht = new Hashtable();
                ht.Add("[FIRSTNAME]", user.FirstName);
                ht.Add("[LINK]", directory + "VerifyEmail/" + user.Id);
                string response = new MailService(_mailTemplateContext).SendMailFromTemplate("register_activation", user.Email, "", ht);
                #endregion
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
           



            return Ok(new { isSuccessful = true, message = "Registration is Successful." });
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        [Route("GetProfile/{id}")]
        public async Task<ActionResult<dynamic>> GetProfile(Guid id)
        {
            var user = await _context.User.FindAsync(id);
            var invitations = _projectContext.VW_ProjectParticipant.ToList()
                            .Where(item => item.UserId == id && item.Status == false).ToList();

            var activeTasks = _taskContext.VW_Task.ToList().Where(item => item.AssigneeId == id && item.Status == Convert.ToInt16(TaskStatuses.Active));
            var closedTasks = _taskContext.VW_Task.ToList().Where(item => item.AssigneeId == id && item.Status == Convert.ToInt16(TaskStatuses.Closed));
            var workLogs = _workLogContext.VW_WorkLog.ToList().Where(item => item.UserId == id);
            var activeProjects = _projectContext.VW_ProjectParticipant.ToList().Where(item => item.UserId == id && item.ProjectStatus == true);
            var closedProjects = _projectContext.VW_ProjectParticipant.ToList().Where(item => item.UserId == id && item.ProjectStatus == false);

            #region recentProjects doldurma
            var recentProjects = _context.VW_RecentProjects.ToList().Where(item => item.UserId == id).GroupBy(item => item.ProjectName).Select(x => x.FirstOrDefault());

            RecentThreeProjects recent3Projects = new RecentThreeProjects();

            recent3Projects.project1 = new ProfileProjectCard();
            recent3Projects.project2 = new ProfileProjectCard();
            recent3Projects.project3 = new ProfileProjectCard();

            var projects = _projectContext.VW_ProjectParticipant.ToList().Where(item => item.UserId == id);
            if (recentProjects.Any()) //en az 1 geliyorsa ilk projeyi ekle
            {
                recent3Projects.project1.projectId = recentProjects.ToList()[0].ProjectId;
                recent3Projects.project1.projectName = recentProjects.ToList()[0].ProjectName;

                if (recentProjects.Count() >= 2) //en az 2 geliyorsa ikinci projeyi ekle.
                {
                    recent3Projects.project2.projectId = recentProjects.ToList()[1].ProjectId;
                    recent3Projects.project2.projectName = recentProjects.ToList()[1].ProjectName;

                    if (recentProjects.Count() >= 3)//3 tane geliyorsa sorun yok.
                    {
                        recent3Projects.project3.projectId = recentProjects.ToList()[2].ProjectId;
                        recent3Projects.project3.projectName = recentProjects.ToList()[2].ProjectName;
                    }
                    else //2tane geldi demektir.
                    {
                        if (projects.Count() >= 3) //3 veya daha fazla projesi varsa eklediklerimiz dışındakini al.
                        {
                            Guid lastProjectId = projects.Where(item => item.ProjectId != recent3Projects.project1.projectId && item.ProjectId != recent3Projects.project2.projectId).FirstOrDefault().ProjectId;
                            var lastProject = await _projectOnlyContext.Project.FindAsync(lastProjectId);
                            recent3Projects.project3.projectId = lastProject.Id;
                            recent3Projects.project3.projectName = lastProject.Name;
                        }
                    }
                }
                else // sadece 1 tane geliyor demektir.
                {
                    if (projects.Count() >= 2) //daha çok varsa ama recentprojects'ten gelmiyorsa.
                    {
                        Guid lastProjectId = projects.Where(item => item.ProjectId != recent3Projects.project1.projectId).FirstOrDefault().ProjectId;
                        var lastProject = await _projectOnlyContext.Project.FindAsync(lastProjectId);
                        recent3Projects.project2.projectId = lastProject.Id;
                        recent3Projects.project2.projectName = lastProject.Name;

                        if (projects.Count() >= 3) //3. de var mı?
                        {
                            Guid lastProjectId3 = projects.Where(item => item.ProjectId != recent3Projects.project1.projectId && item.ProjectId != recent3Projects.project2.projectId).FirstOrDefault().ProjectId;
                            var lastProject3 = await _projectOnlyContext.Project.FindAsync(lastProjectId3);
                            recent3Projects.project3.projectId = lastProject3.Id;
                            recent3Projects.project3.projectName = lastProject3.Name;
                        }

                    }
                }
            }
            else// hiç gelmiyor demektir.
            {

                if (projects.Any())
                {
                    Guid lastProjectId = projects.FirstOrDefault().ProjectId;
                    var lastProject = await _projectOnlyContext.Project.FindAsync(lastProjectId);
                    recent3Projects.project1.projectId = lastProject.Id;
                    recent3Projects.project1.projectName = lastProject.Name;
                    if (projects.Count() >= 2) //daha çok varsa ama recentprojects'ten gelmiyorsa.
                    {
                        Guid lastProjectId2 = projects.Where(item => item.ProjectId != recent3Projects.project1.projectId).FirstOrDefault().ProjectId;
                        var lastProject2 = await _projectOnlyContext.Project.FindAsync(lastProjectId2);
                        recent3Projects.project2.projectId = lastProject2.Id;
                        recent3Projects.project2.projectName = lastProject2.Name;

                        if (projects.Count() >= 3) //3. de var mı?
                        {
                            Guid lastProjectId3 = projects.Where(item => item.ProjectId != recent3Projects.project1.projectId && item.ProjectId != recent3Projects.project2.projectId).FirstOrDefault().ProjectId;
                            var lastProject3 = await _projectOnlyContext.Project.FindAsync(lastProjectId3);
                            recent3Projects.project3.projectId = lastProject3.Id;
                            recent3Projects.project3.projectName = lastProject3.Name;
                        }

                    }
                }
            }

            #endregion

            ProfileStats stats = new ProfileStats();

            stats.activeTasks = activeTasks.Count();
            stats.completedTasks = closedTasks.Count();
            stats.activeProjects = activeProjects.Count();
            stats.completedProjects = closedProjects.Count();
            stats.completedWorkLogs = workLogs.Count();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new { isSuccessful = true, data = new { user = user, stats = stats,
                            recentProjects = recent3Projects, invitations = invitations } });
        }


        [HttpGet]
        [Route("GetUserInfo")]
        public ActionResult GetUserInfo([FromHeader(Name = "Authorization")] string token)
        {
            Guid id = TokenService.getUserId(token);
            var user = _context.User.Find(id);
            if(user == null)
            {
                return NoContent();
            }
            var projects = _projectContext.VW_ProjectParticipant.ToList().Where(item => item.UserId == id);
            int projectCount = projects.Count();
            var tasks = _taskContext.VW_Task.ToList().Where(item => item.AssigneeId == id);
            int closedTaskCount = tasks.Where(item => item.Status == 3).Count();
            int activeTaskCount = tasks.Where(item => item.Status == 1).Count();

            return Ok(new
            {
                isSuccessful = true,
                data = new
                {
                    ProjectCount = projectCount,
                    ClosedTaskCount = closedTaskCount,
                    ActiveTaskCount = activeTaskCount,
                    User = user
                }
            });

        }

        [HttpPost]
        [Route("ManagePreferences")]
        public ActionResult ManagePreferences([FromHeader(Name = "Authorization")] string token, Preferences userPreferences)
        {
            Guid userId = TokenService.getUserId(token);

            var user = _context.User.Find(userId);
            user.SendEmail = userPreferences.SendEmail;
            user.SendNotification = userPreferences.SendNotification;
            _context.User.Update(user);

            try
            {
                _context.SaveChanges();

            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok(new { isSuccessfull= true });

        }

        [HttpPost]
        [Route("VerifyEmail/{userId}")]
        [AllowAnonymous]
        public ActionResult VerifyEmail(Guid userId)
        {
            var user = _context.User.Find(userId);
            user.ActivationStatus = true;
            user.SendEmail = true;
            user.SendNotification = true;
            _context.User.Update(user);

            try
            {
                _context.SaveChanges();

            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return Ok();

        }

        [HttpPut]
        [Route("ChangePassword/{id}")]
        public async Task<IActionResult> ChangePassword(Guid id, ChangePwModel model)
        {
            
            User oldUser = _context.User.Find(id);

            if (BC.Verify(model.oldPassword, oldUser.Password))
            {
                oldUser.Password = BC.HashPassword(model.newPassword);
                _context.Entry(oldUser).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!UserExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return Ok(new { isSuccessful = true, message = "Updated." });
            }
            else
            {
                return Ok(new { isSuccessful = false, message = "Current Password does not match." });
            }
        }


        [HttpGet]
        [Route("GetNotifications")]
        public IActionResult GetNotifications([FromHeader(Name = "Authorization")] string token)
        {
            var userId = TokenService.getUserId(token);
            var notifications = _notificationContext.Notification.ToList().Where(item => item.UserId == userId).ToList();

            return Ok(new { data = notifications });

        }

        private bool UserExists(Guid id)
        {
            return _context.User.Any(e => e.Id == id);
        }


    }
    public class ProfileStats
    {
        public int activeTasks { get; set; }
        public int activeProjects { get; set; }
        public int completedTasks { get; set; }
        public int completedProjects { get; set; }
        public int completedWorkLogs { get; set; }
    }

    public class RecentThreeProjects
    {
        public ProfileProjectCard project1 { get; set; }
        public ProfileProjectCard project2 { get; set; }
        public ProfileProjectCard project3 { get; set; }
    }

    public class ProfileProjectCard
    {
        public Guid projectId { get; set; }
        public string projectName { get; set; }
    }

    public class Preferences
    {
        public bool SendEmail { get; set; }
        public bool SendNotification { get; set; }
    }

    public class ChangePwModel
    {
        public string oldPassword { get; set; }
        public string newPassword { get; set; }
    }

}
