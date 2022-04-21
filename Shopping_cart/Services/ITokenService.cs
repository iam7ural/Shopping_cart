using Azersun.Shopping_cart.Models;

namespace Azersun.Shopping_cart.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}
