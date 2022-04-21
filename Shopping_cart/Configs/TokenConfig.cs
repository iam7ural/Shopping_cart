using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Configs
{
    public class TokenConfig
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public int Expires { get; set; }
    }
}
