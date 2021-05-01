using System;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using TaskyService.DbContexts;

namespace TaskyService.Services
{
    public class MailService
    {

        private readonly MailboxAddress from = new MailboxAddress("Tasky", "taskydev@gmail.com");
        private readonly string authId = "taskydev@gmail.com";
        private readonly string authPw = "12122012aA";
        private readonly bool UseTestEmail = true;
        private readonly string TestEmail = "volkan.davsan@isik.edu.tr";

        private readonly MailTemplateContext _context;

        public MailService(MailTemplateContext context)
        {
            _context = context;
        }


        public string SendMailFromTemplate(string mailTemplateCode, string to, string cc, Hashtable ht)
        {
            #region fill email
            MimeMessage message = new MimeMessage();
            MailboxAddress mailTo;
            if (UseTestEmail)
            {
                mailTo = new MailboxAddress("User", TestEmail);

            }
            else
            {
                mailTo = new MailboxAddress("User", to);

            }


            message.From.Add(from);
            message.To.Add(mailTo);

            if (!string.IsNullOrEmpty(cc))
            {
                MailboxAddress mailCc = new MailboxAddress("Info", cc);
                message.Cc.Add(mailCc);
            }


            var mailTemplate = _context.MailTemplate.ToList().Where(x => x.Code == mailTemplateCode).FirstOrDefault();

            string mailBody = mailTemplate.Body;
            string mailSubject = mailTemplate.Subject;

            foreach (DictionaryEntry de in ht)
            {
                mailBody = mailBody.Replace(de.Key.ToString(), ((de.Value != null) ? de.Value.ToString() : ""));
                mailSubject = mailSubject.Replace(de.Key.ToString(), ((de.Value != null) ? de.Value.ToString() : ""));
            }


            message.Body = new TextPart(TextFormat.Html) { Text = mailBody };
            message.Subject = mailSubject;
            #endregion

            #region smtpclient
            string response = "";
            try
            {
                SmtpClient client = new SmtpClient();
                client.Connect("smtp.gmail.com", 465, true);
                client.Authenticate(authId, authPw);
                client.Send(message);
                client.Disconnect(true);
                client.Dispose();

                response = "Email sent.";

            }
            catch (Exception e)
            {
                response = "Failed to send email.";
            }
            #endregion
            return response;
        }
    }
}
