using Azersun.Shopping_cart.Models;

namespace Azersun.Shopping_cart.Services
{
    public interface IAuthenticationService
    {
        int Login(string userName, string password, string domain);
        int LoginWithUsername(string userName, string password);
    }
}
