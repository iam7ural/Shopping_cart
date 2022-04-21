using Azersun.Shopping_cart.Utilities;
using Microsoft.AspNetCore.Mvc;

namespace Azersun.Shopping_cart.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CryptoController : ControllerBase
    {
        public CryptoController()
        {

        }
        [HttpGet]
        public string Encrypt(string data)
        {
            return Cryptography.Encrypt(data);
        }

        [HttpGet]
        public string Decrypt(string data)
        {
            return Cryptography.Decrypt(data);
        }
    }
}
