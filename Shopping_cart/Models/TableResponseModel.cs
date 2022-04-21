using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Models
{
    public class TableResponseModel<T>
    {
        public List<T> items { get; set; }
        public int totalcount { get; set; }
    }
}
