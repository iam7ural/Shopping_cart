using Azersun.Shopping_cart.Configs;
using Azersun.Shopping_cart.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Azersun.Shopping_cart.Services
{
    public class TokenService : ITokenService
    {
        private readonly TokenConfig config;

        public TokenService(IOptions<TokenConfig> config)
        {
            this.config = config.Value;
        }

        public string CreateToken(User user)
        {
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.Key));
            SigningCredentials signInCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            JwtSecurityToken token = new JwtSecurityToken(
                claims: GenerateClaims(ref user),
                expires: DateTime.Now.AddDays(config.Expires),
                signingCredentials: signInCredentials);


            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private List<Claim> GenerateClaims(ref User user)
        {
            List<Claim> claims = new List<Claim>();

            claims.Add(new Claim("Id", user.Id.ToString()));
            claims.Add(new Claim("percode", user.percode));
            claims.Add(new Claim("accountname", user.accountname));
            claims.Add(new Claim("firstname", user.firstname));
            claims.Add(new Claim("lastname", user.lastname));
            claims.Add(new Claim("fathername", user.fathername));
            claims.Add(new Claim("email", user.email));
            claims.Add(new Claim("roleid", user.roleid.ToString()));

            return claims;
        }
    }
}
