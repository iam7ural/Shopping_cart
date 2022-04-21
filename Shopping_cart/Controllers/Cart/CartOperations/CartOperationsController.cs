using Azersun.Shopping_cart.Services;
using Azersun.Shopping_cart.Utilities;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Controllers.Basket.BasketOperations
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CartOperationsController : Controller
    {
        [HttpPost, Authorize]
        public IActionResult AddToCart([FromBody] int product_id)
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
            int userId = Convert.ToInt32(claims.Where((c) => c.Type == "Id").FirstOrDefault().Value);
            
            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@USER_ID", userId);
            parameters.Add("@PRODUCT_ID", product_id);
            parameters.Add("@QUANTITY", 1);

            string command_check = @"SELECT COUNT(CART_DETAIL_ID) FROM CART_DETAILS
                                    WHERE [USER_ID] = @USER_ID AND PRODUCT_ID = @PRODUCT_ID";

            string command_add = @"INSERT INTO CART_DETAILS (
                                                                     [USER_ID],
                                                                     PRODUCT_ID,
                                                                     QUANTITY,
                                                                     PRICE
                                                                    )
                                                             VALUES (  
                                                                     @USER_ID,
                                                                     @PRODUCT_ID,
                                                                     @QUANTITY,
                                                                     (SELECT TOP(1) PRICE FROM PRODUCTS WHERE PRODUCT_ID = @PRODUCT_ID)
                                                                    )";

            int count =0 ;
            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    count = connection.Query<int>(command_check, parameters).SingleOrDefault();
                    if (count == 0)
                    {
                        connection.Execute(command_add, parameters);
                    }
                    else
                    {
                        IncreaseQuantity(product_id);
                    }
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }
        }

        [HttpPost, Authorize]
        public IActionResult IncreaseQuantity([FromBody] int product_id)
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
            int userId = Convert.ToInt32(claims.Where((c) => c.Type == "Id").FirstOrDefault().Value);

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@USER_ID", userId);
            parameters.Add("@PRODUCT_ID", product_id);


            string command_update_quantity = @" UPDATE CART_DETAILS 
                                                SET QUANTITY = QUANTITY + 1
                                                WHERE [USER_ID] = @USER_ID AND PRODUCT_ID = @PRODUCT_ID";

            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    connection.Execute(command_update_quantity, parameters);

                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }
        }

        [HttpPost, Authorize]
        public IActionResult DecreaseQuantity([FromBody] int product_id)
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
            int userId = Convert.ToInt32(claims.Where((c) => c.Type == "Id").FirstOrDefault().Value);

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@USER_ID", userId);
            parameters.Add("@PRODUCT_ID", product_id);

            string command_check = @"SELECT COUNT(CART_DETAIL_ID) FROM CART_DETAILS
                                    WHERE [USER_ID] = @USER_ID AND PRODUCT_ID = @PRODUCT_ID";

            string command_get_quantity = @"SELECT QUANTITY FROM CART_DETAILS
                                        WHERE [USER_ID] = @USER_ID AND PRODUCT_ID = @PRODUCT_ID";

            string command_update_quantity = @" UPDATE CART_DETAILS 
                                                SET QUANTITY = QUANTITY - 1
                                                WHERE [USER_ID] = @USER_ID AND PRODUCT_ID = @PRODUCT_ID";

            int count = 0, quantity = 0;
            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    count = connection.Query<int>(command_check, parameters).SingleOrDefault();
                    if (count == 0)
                    {
                        return StatusCode(StatusCodes.Status400BadRequest, "count == 0");
                    }
                    else
                    {
                        quantity = connection.Query<int>(command_get_quantity, parameters).SingleOrDefault();
                        if (quantity == 1)
                        {
                            RemoveFromCart(product_id);
                        }
                        else
                        {
                            connection.Execute(command_update_quantity, parameters);
                        }

                    }
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }
        }

        [HttpPost, Authorize]
        public IActionResult RemoveFromCart([FromBody] int product_id)
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
            int userId = Convert.ToInt32(claims.Where((c) => c.Type == "Id").FirstOrDefault().Value);

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@USER_ID", userId);
            parameters.Add("@PRODUCT_ID", product_id);

            string command_remove = @"DELETE FROM CART_DETAILS
                                    WHERE [USER_ID] = @USER_ID AND PRODUCT_ID = @PRODUCT_ID";

            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    connection.Execute(command_remove, parameters);
   
                    return Ok();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }
        }
    }
}
