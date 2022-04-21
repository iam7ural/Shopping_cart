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
    public class ProductsListController : ControllerBase
    {
        [HttpGet, Authorize]
        public IActionResult GetProductsList(  [FromQuery(Name = "page")] string page = "0",
                                                [FromQuery(Name = "size")] string size = "9",
                                                [FromQuery(Name = "sort")] string sort = "ID",
                                                [FromQuery(Name = "order")] string order = "desc",
                                                [FromQuery(Name = "search")] string search = "",
                                                [FromQuery(Name = "category_id")] string category_id = "-1",
                                                [FromQuery(Name = "size_id")] string size_id = "-1",
                                                [FromQuery(Name = "color_id")] string color_id = "-1")
        {
            string filter = "";
            if (category_id != "-1" && category_id != "")
            {
                if (filter != "")
                {
                    filter += $" AND PR.CATEGORY_ID = '{category_id}' ";
                }
                else
                {
                    filter += $" PR.CATEGORY_ID = '{category_id}' ";
                }
            }

            if (size_id != "-1" && size_id != "")
            {
                if (filter != "")
                {
                    filter += $" AND PR.SIZE_ID = '{size_id}' ";
                }
                else
                {
                    filter += $" PR.SIZE_ID = '{size_id}' ";
                }
            }

            if (color_id != "-1" && color_id != "")
            {
                if (filter != "")
                {
                    filter += $" AND PR.COLOR_ID = '{color_id}' ";
                }
                else
                {
                    filter += $" PR.COLOR_ID = '{color_id}' ";
                }
            }


            string command = @$"SELECT
	                                PR.PRODUCT_ID,
	                                PR.PRODUCT_NAME,
	                                PR.PRICE,
	                                PR.CATEGORY_ID,
	                                CA.CATEGORY_NAME AS category_text,
	                                PR.SIZE_ID,
	                                S.SIZE_NAME AS size_text,
	                                PR.COLOR_ID,
	                                CO.COLOR_NAME AS color_text
                                FROM PRODUCTS PR
                                INNER JOIN CATEGORIES CA ON CA.CATEGORY_ID = PR.CATEGORY_ID
                                INNER JOIN SIZES S ON S.SIZE_ID = PR.SIZE_ID
                                INNER JOIN COLORS CO ON CO.COLOR_ID = PR.COLOR_ID
								{((!string.IsNullOrEmpty(search) || filter != "") ?
                                $@"WHERE {(filter == "" ? "" : (filter + " AND "))}  
                                                                                (UPPER(PR.PRODUCT_NAME) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(PR.PRICE) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(CA.CATEGORY_NAME) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(S.SIZE_NAME) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(CO.COLOR_NAME) LIKE UPPER(@SEARCH))" : "")}
                                ORDER BY {(sort.ToUpper() == "ID" ? " PRODUCT_ID " : sort)} {(order == "asc" ? "desc" : "asc")}
                                {(page != "0" ? "OFFSET @OFFSET ROWS FETCH NEXT @FETCH ROWS ONLY" : "")}";


            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@OFFSET", (Int32.Parse(page) - 1) * Int32.Parse(size));
            parameters.Add("@FETCH", Int32.Parse(size));
            parameters.Add("@SEARCH", $"%{search}%", DbType.String);


            List<Products> list = null;
            TableResponseModel<Products> trm = new TableResponseModel<Products>();
            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    list = connection.Query<Products>(command, parameters).ToList();
                    int totalcount = GetProductsListCount(search, category_id, size_id, color_id);

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

        private int GetProductsListCount(string search, string category_id,string size_id, string color_id)
        {
            string filter = "";
            if (category_id != "-1" && category_id != "")
            {
                if (filter != "")
                {
                    filter += $" AND CATEGORY_ID = '{category_id}' ";
                }
                else
                {
                    filter += $" CATEGORY_ID = '{category_id}' ";
                }
            }

            if (size_id != "-1" && size_id != "")
            {
                if (filter != "")
                {
                    filter += $" AND SIZE_ID = '{size_id}' ";
                }
                else
                {
                    filter += $" SIZE_ID = '{size_id}' ";
                }
            }

            if (color_id != "-1" && color_id != "")
            {
                if (filter != "")
                {
                    filter += $" AND COLOR_ID = '{color_id}' ";
                }
                else
                {
                    filter += $" COLOR_ID = '{color_id}' ";
                }
            }

            string command = @$"SELECT
	                                COUNT(PR.PRODUCT_ID)
                                FROM PRODUCTS PR
                                INNER JOIN CATEGORIES CA ON CA.CATEGORY_ID = PR.CATEGORY_ID
                                INNER JOIN SIZES S ON S.SIZE_ID = PR.SIZE_ID
                                INNER JOIN COLORS CO ON CO.COLOR_ID = PR.COLOR_ID
								{((!string.IsNullOrEmpty(search) || filter != "") ?
                                $@"WHERE {(filter == "" ? "" : (filter + " AND "))}  
                                                                                (UPPER(PR.PRODUCT_NAME) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(PR.PRICE) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(CA.CATEGORY_NAME) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(S.SIZE_NAME) LIKE UPPER(@SEARCH) " +
                                                                                "OR UPPER(CO.COLOR_NAME) LIKE UPPER(@SEARCH))" : "")}";

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
