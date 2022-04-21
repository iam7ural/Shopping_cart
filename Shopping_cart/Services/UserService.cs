using Azersun.Shopping_cart.Models;
using Azersun.Shopping_cart.Utilities;
using Dapper;
using System.Data;
using System.IO;
using System.Linq;

namespace Azersun.Shopping_cart.Services
{
    public class UserService : IUserService
    {
        public void AddUserToUserlist(User user,int withadmin = 0)
        {
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@PERCODE", user.Id);
            parameters.Add("@FIRSTNAME", user.firstname);
            parameters.Add("@LASTNAME", user.lastname);
            parameters.Add("@FATHERNAME", user.fathername);
            parameters.Add("@EMAIL", user.email);
            parameters.Add("@ROLEID", 3); // user
            parameters.Add("@ACCOUNTNAME", user.accountname);

            string command = "";
            if (withadmin == 0)
            {
                command = $@"IF NOT EXISTS (SELECT * FROM TBL_USERS 
                                                WHERE PERCODE = @PERCODE)
                                BEGIN       
                                    INSERT INTO TBL_USERS (	PERCODE, ROLEID,
                                                            FIRSTNAME, LASTNAME,
                                                            FATHERNAME, EMAIL, 
                                                            ACCOUNTNAME, LAST_LOGIN,
                                                            CREATED_DATE, STATUS)
                                    VALUES              (	@PERCODE, @ROLEID,
                                                            @FIRSTNAME, @LASTNAME,
                                                            @FATHERNAME, @EMAIL,
                                                            @ACCOUNTNAME, GETDATE(),
                                                            GETDATE(),1)
                                END
                                ELSE
                                BEGIN
	                                UPDATE TBL_USERS
	                                SET LAST_LOGIN = GETDATE()
	                                WHERE PERCODE = @PERCODE
                                END";
            }
            else
            {
                command = $@"IF NOT EXISTS (SELECT * FROM TBL_USERS 
                                                WHERE PERCODE = @PERCODE)
                                BEGIN       
                                    INSERT INTO TBL_USERS (	PERCODE, ROLEID,
                                                            FIRSTNAME, LASTNAME,
                                                            FATHERNAME, EMAIL, 
                                                            ACCOUNTNAME, LAST_LOGIN,
                                                            CREATED_DATE, STATUS)
                                    VALUES              (	@PERCODE, @ROLEID,
                                                            @FIRSTNAME, @LASTNAME,
                                                            @FATHERNAME, @EMAIL,
                                                            @ACCOUNTNAME, GETDATE(),
                                                            GETDATE(),1)
                                END";
            }





            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                connection.Execute(command, parameters);
            }
        }

        public User GetUser(int id)
        {
            string command = @"SELECT TOP(1) 
                                        TU.ID AS Id,
                                        TU.USERNAME AS username,
                                        IIF(TU.PERCODE IS NULL, '',TU.PERCODE) AS percode,
                                        IIF(TU.ROLEID > 0, TU.ROLEID, 3) AS roleid, 
                                        IIF(TU.ACCOUNTNAME IS NULL, '',TU.ACCOUNTNAME) AS AccountName,
                                        IIF(TU.ENTERPRISEID IS NULL, 0,TU.ENTERPRISEID) AS enterpriseid,
                                        IIF(TU.GATEID IS NULL, 0,TU.GATEID) AS gateid,
                                        IIF(TU.EMAIL IS NULL, '',TU.EMAIL) AS Email,
                                        IIF(TU.FIRSTNAME IS NULL, '',TU.FIRSTNAME) AS FirstName,
                                        IIF(TU.LASTNAME IS NULL, '',TU.LASTNAME) AS LastName,
                                        IIF(TU.FATHERNAME IS NULL, '',TU.FATHERNAME) AS FatherName
                                 FROM TBL_USERS TU
                                WHERE TU.ID = @ID";

            User user = null;

            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST)) // (SqlConnection connection = new SqlConnection("ConnectionString"))
            {
                user = connection.Query<User>(command, new { id }).SingleOrDefault();
            }

            return user;
        }
    }
}

