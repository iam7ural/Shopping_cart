using Azersun.Shopping_cart.Models;
using Azersun.Shopping_cart.Models.Products;
using Azersun.Shopping_cart.Utilities;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Controllers.Guests.GuestsList
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CartDetailListController : ControllerBase
    {
        [HttpGet, Authorize]
        public IActionResult GetCartDetailList(  [FromQuery(Name = "page")] string page = "0",
                                                [FromQuery(Name = "size")] string size = "9",
                                                [FromQuery(Name = "sort")] string sort = "ID",
                                                [FromQuery(Name = "order")] string order = "desc",
                                                [FromQuery(Name = "search")] string search = "")
        {

            string command = @$"SELECT
	                                CD.CART_DETAIL_ID,
	                                CD.USER_ID,
	                                CD.PRODUCT_ID,
	                                PR.PRODUCT_NAME AS product_text,
	                                CD.QUANTITY,
	                                CD.PRICE,
	                                (CD.PRICE * CD.QUANTITY) AS total
                                FROM CART_DETAILS CD
                                INNER JOIN PRODUCTS PR ON PR.PRODUCT_ID = CD.PRODUCT_ID
								{((!string.IsNullOrEmpty(search) ) ?
                                $@"WHERE 
                                        (UPPER(PR.PRODUCT_NAME) LIKE UPPER(@SEARCH) " +
                                        "OR UPPER(CD.QUANTITY) LIKE UPPER(@SEARCH) " +
                                        "OR UPPER(CD.PRICE) LIKE UPPER(@SEARCH))" : "")}
                                ORDER BY {(sort.ToUpper() == "ID" ? " PRODUCT_ID " : sort)} {(order == "asc" ? "desc" : "asc")}
                                {(page != "0" ? "OFFSET @OFFSET ROWS FETCH NEXT @FETCH ROWS ONLY" : "")}";


            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@OFFSET", (Int32.Parse(page) - 1) * Int32.Parse(size));
            parameters.Add("@FETCH", Int32.Parse(size));
            parameters.Add("@SEARCH", $"%{search}%", DbType.String);


            List<CartDetail> list = null;
            TableResponseModel<CartDetail> trm = new TableResponseModel<CartDetail>();
            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    list = connection.Query<CartDetail>(command, parameters).ToList();
                    int totalcount = GetCartDetailListCount(search);

                    trm.items = list;
                    trm.totalcount = totalcount;
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }

            return Ok(trm);
        }

        private int GetCartDetailListCount(string search)
        {

            string command = @$"SELECT
	                                COUNT(CD.CART_DETAIL_ID)
                                FROM CART_DETAILS CD
                                INNER JOIN PRODUCTS PR ON PR.PRODUCT_ID = CD.PRODUCT_ID
								{((!string.IsNullOrEmpty(search)) ?
                                $@"WHERE 
                                        (UPPER(PR.PRODUCT_NAME) LIKE UPPER(@SEARCH) " +
                                        "OR UPPER(CD.QUANTITY) LIKE UPPER(@SEARCH) " +
                                        "OR UPPER(CD.PRICE) LIKE UPPER(@SEARCH))" : "")}";

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@SEARCH", $"%{search}%", DbType.String);

            int count = 0;

            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    count = connection.Query<int>(command, parameters).Single();
                    return count;
                }
                catch (Exception ex)
                {
                    return 0;
                    //return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }

            //return Ok(count);
        }

    }
}
