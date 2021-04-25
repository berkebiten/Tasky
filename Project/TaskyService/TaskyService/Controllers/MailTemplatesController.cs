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
    public class MailTemplatesController : ControllerBase
    {
        private readonly MailTemplateContext _context;

        public MailTemplatesController(MailTemplateContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetAll")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MailTemplate>>> GetMailTemplates()
        {
            return await _context.MailTemplate.ToListAsync();
        }

        [HttpPost]
        [Route("Insert")]
        [AllowAnonymous]
        public async Task<ActionResult<MailTemplate>> PostMailTemplate(MailTemplate mt)
        {
            _context.MailTemplate.Add(mt);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (MailTemplateExists(mt.Code))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { isSuccessful = true, message = "Mail Template Created Successfuly." });
        }

        private bool MailTemplateExists(string code)
        {
            return _context.MailTemplate.Any(e => e.Code == code);
        }
    }
}
