using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Models
{
    public class CartDetail
    {
        public int cart_detail_id { get; set; }
        public int user_id { get; set; }
        public int product_id { get; set; }
        public string product_text { get; set; }
        public int quantity { get; set; }
        public decimal price { get; set; }
        public decimal total { get; set; }
    }
}
