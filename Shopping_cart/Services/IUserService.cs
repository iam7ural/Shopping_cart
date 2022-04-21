using Azersun.Shopping_cart.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Services
{
    public interface IUserService
    {
        User GetUser(int id);

        void AddUserToUserlist(User user, int withadmin = 0);

    }
}
