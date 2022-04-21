using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Models.Products
{
    public class Products
    {
        public int product_id { get; set; }
        public string product_name { get; set; }
        public decimal price { get; set; }
        public int category_id { get; set; }
        public string category_text { get; set; }
        public int size_id { get; set; }
        public string size_text { get; set; }
        public int color_id { get; set; }
        public string color_text { get; set; }
    }
}
