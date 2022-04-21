namespace Azersun.Shopping_cart.Models
{
    public class User
    {
        public string Id { get; set; }
        public string username { get; set; }
        public string percode { get; set; }
        public int roleid { get; set; }
        public string roleid_text { get; set; }
        public int enterpriseid { get; set; }
        public string enterpriseid_text { get; set; }        
        public int gateid { get; set; }
        public string gateid_text { get; set; }
        public string accountname { get; set; }
        public string email { get; set; }
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string fathername { get; set; }
        public int orgcode { get; set; }
        public string orgname { get; set; }
        public string position { get; set; }
        public int status { get; set; }
        public string password { get; set; }
        public string status_text { get; set; }
        public string reason { get; set; }
        public string finishwork { get; set; }
    }
}
