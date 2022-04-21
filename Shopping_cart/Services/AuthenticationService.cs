using Azersun.Shopping_cart.Configs;
using Azersun.Shopping_cart.Utilities;
using Dapper;
using Microsoft.Extensions.Options;
using System;
using System.Data;
using System.DirectoryServices;
using System.Linq;

namespace Azersun.Shopping_cart.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private const string SAMAccountNameAttribute = "sAMAccountName";
        private const string Id = "description";

        private readonly LDAPConfig config;

        public AuthenticationService(IOptions<LDAPConfig> config)
        {
            this.config = config.Value;
        }

        public int Login(string userName, string password, string domain)
        {
            try
            {
                using (DirectoryEntry entry = new DirectoryEntry(config.Directory + domain, userName, password))
                {
                    using (DirectorySearcher searcher = new DirectorySearcher(entry))
                    {
                        searcher.Filter = String.Format("({0}={1})", SAMAccountNameAttribute, userName);
                        searcher.PropertiesToLoad.Add(SAMAccountNameAttribute);
                        searcher.PropertiesToLoad.Add(Id);

                        var result = searcher.FindOne();

                        if (result != null)
                        {
                            var samAccountName = result.Properties[SAMAccountNameAttribute];
                            var ssn = result.Properties[Id];

                            return (ssn.Count <= 0 ? 0 : Int32.Parse(ssn[0].ToString().Split(':')[1]));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // if we get an error, it means we have a login failure.
                // Log specific exception
            }
            return 0;
        }

        public int LoginWithUsername(string userName, string password)
        {
            try
            {
                DynamicParameters parameters = new DynamicParameters();
                parameters.Add("@USERNAME", userName);
                parameters.Add("@PASSWORD", Cryptography.Encrypt(password));

                string command_uname_count = @" SELECT COUNT(ID) FROM TBL_USERS WHERE USERNAME = @USERNAME";

                int count = 0;
                string pass = "";
                using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
                {
                    count = connection.Query<int>(command_uname_count, parameters).SingleOrDefault();
                    if (count > 0)
                    {
                        string command_uname = @" SELECT TOP(1) PASSWORD FROM TBL_USERS WHERE USERNAME = @USERNAME";
                        pass = connection.Query<string>(command_uname, parameters).SingleOrDefault();
                        if (pass !="")
                        {
                            if (pass == Cryptography.Encrypt(password))
                            {
                                string command_percode = @" SELECT TOP(1) ID FROM TBL_USERS WHERE USERNAME = @USERNAME";
                                return connection.Query<int>(command_percode, parameters).SingleOrDefault();
                            }
                            else
                            {
                                return 0;
                            }
                        }
                        else
                        {
                            return 0;
                        }
                    }
                    else
                    {
                        return 0;
                    }
                }
            }
            catch (Exception)
            {
                return 0;
            }
            return 0;
        }
    }
}
