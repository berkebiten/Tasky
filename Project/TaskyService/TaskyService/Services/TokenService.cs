using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskyService.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace TaskyService.Services
{
    public static class TokenService
    {
        private const double EXPIRE_HOURS = 1.0;
        public static string CreateToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(Settings.Secret);
            var tokenHandler = new JwtSecurityTokenHandler();
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Email, user.Email.ToString()),
                    new Claim(ClaimTypes.PrimarySid, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(EXPIRE_HOURS),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(descriptor);
            return tokenHandler.WriteToken(token);
        }

        public static String GetUserId(String token)
        {
            var stream = token;
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadJwtToken(token);
            return jsonToken.Claims.ToList().Where(claim => claim.Type == "primarysid").ToList().FirstOrDefault().ToString();
        }
    }
}
