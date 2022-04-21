using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Models.MyBrandAppeals
{
    public class Sourcebase
    {
        public int form_id { get; set; }
        public int tgbd_id { get; set; }
        public int form_type { get; set; }
        public string form_type_text { get; set; }
        public string brand_id { get; set; }
        public string brand_name { get; set; }
        public int brand_category_id { get; set; }
        public string brand_category_id_text { get; set; }
        public string classification_code { get; set; }
        public string classification_code_text { get; set; }
        public int companycode_owner { get; set; }
        public string companycode_owner_text { get; set; }
        public int country_id { get; set; }
        public string country_text { get; set; }
        public int companycode_lisence { get; set; }
        public string companycode_lisence_text { get; set; }
        public int document_lisence { get; set; }
        public int document_duration { get; set; }
        public int document_righths { get; set; }
        public string startdate { get; set; }
        public string finishdate { get; set; }
        public int dateduration_id { get; set; }
        public string dateduration_id_text { get; set; }
        public string certificate_number { get; set; }
        public int document_certificate { get; set; }
        public int document_email { get; set; }
        public string note { get; set; }


    }
}
