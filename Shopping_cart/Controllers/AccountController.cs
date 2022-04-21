using Azersun.Shopping_cart.Models;
using Azersun.Shopping_cart.Services;
using Azersun.Shopping_cart.Utilities;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Data;
using System.Linq;
using System.Net;

namespace Azersun.Shopping_cart.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAuthenticationService authService;
        private readonly ITokenService tokenService;
        private readonly IUserService userService;

        public AccountController(IAuthenticationService authService, ITokenService tokenService, IUserService userService)
        {
            this.authService = authService;
            this.tokenService = tokenService;
            this.userService = userService;
        }

        [HttpPost]
        public IActionResult Login([FromBody] Login login)
        {
            //int id = authService.Login(login.Username, login.Password, login.Domain);
            int id = authService.LoginWithUsername(login.Username, login.Password);

            if (id != 0)
            {
                User user = userService.GetUser(id);
                if (user != null)
                {
                }
                string token = tokenService.CreateToken(user);


                return Ok(new { token = token });
            }

            return StatusCode((int)HttpStatusCode.Unauthorized, "İstifadəçi adı və ya şifrəniz yalnışdır");
        }

    }
}
