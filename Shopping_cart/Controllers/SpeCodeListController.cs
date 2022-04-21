using Azersun.Shopping_cart.Utilities;
using Azersun.Shopping_cart.Models;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Azersun.Shopping_cart.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SpeCodeListController : ControllerBase
    {
        [HttpGet, Authorize]
        public IActionResult GetCategories()
        {

            string command = $@"SELECT CATEGORY_ID AS SPC_VALUEINT, CATEGORY_NAME  AS SPC_NAME
                                FROM CATEGORIES
                                ORDER BY CATEGORY_NAME";

            List<SpeCodeList> specodelists = new List<SpeCodeList>();

            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    specodelists = connection.Query<SpeCodeList>(command).ToList();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }

            return Ok(specodelists);
        }

        [HttpGet, Authorize]
        public IActionResult GetSizes()
        {

            string command = $@"SELECT SIZE_ID AS SPC_VALUEINT, SIZE_NAME  AS SPC_NAME
                                FROM SIZES
                                ORDER BY SIZE_NAME";

            List<SpeCodeList> specodelists = new List<SpeCodeList>();

            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    specodelists = connection.Query<SpeCodeList>(command).ToList();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }

            return Ok(specodelists);
        }

        [HttpGet, Authorize]
        public IActionResult GetColors()
        {

            string command = $@"SELECT COLOR_ID AS SPC_VALUEINT, COLOR_NAME  AS SPC_NAME
                                FROM COLORS
                                ORDER BY COLOR_NAME";

            List<SpeCodeList> specodelists = new List<SpeCodeList>();

            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    specodelists = connection.Query<SpeCodeList>(command).ToList();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }

            return Ok(specodelists);
        }
    }

}
