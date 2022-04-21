using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace Azersun.Shopping_cart.Utilities
{
    public static class DbContext
    {
        public enum Types
        {
            TEST
        }

        private static IConfigurationSection ConnectionStrings = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("ConnectionStrings");

        public static SqlConnection GetConnection(Types type)
        {
            string ConnectionString = ConnectionStrings[type.ToString()];

            string connection = Cryptography.Decrypt(ConnectionString);
            return new SqlConnection(connection);
        }

    }
}
