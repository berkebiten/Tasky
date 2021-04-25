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

        public UsersController(UserContext context, MailTemplateContext mailTemplateContext)
        {
            _context = context;
            _mailTemplateContext = mailTemplateContext;
        }

        [HttpPost]
        [Route("Login")]
        [AllowAnonymous]
        public async Task<ActionResult<dynamic>> Authenticate([FromBody] Login model)
        {
            var user = _context.User.ToList().Where(x => x.Email == model.Email && BC.Verify(model.Password, x.Password)).FirstOrDefault();

            if (user == null)
                return NotFound(new {isSuccessful = false, message = "Email or Password is Invalid" });

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

            return NoContent();
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
            Hashtable ht = new Hashtable();
            string response = new MailService(_mailTemplateContext).SendMailFromTemplate("register_activation", user.Email, "", ht);
            
            

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

        private bool UserExists(Guid id)
        {
            return _context.User.Any(e => e.Id == id);
        }
    }
}
