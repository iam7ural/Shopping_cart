using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Azersun.Shopping_cart.Models.MyBrandAppeals;
using Azersun.Shopping_cart.Models;
using Azersun.Shopping_cart.Utilities;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Azersun.Shopping_cart.Controllers.MyBrandAppeals
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SourcebaseListController : ControllerBase
    {
        [HttpGet, Authorize]
        public IActionResult GetSourcebaseList([FromQuery(Name = "page")] string page = "0",
                                    [FromQuery(Name = "size")] string size = "10",
                                    [FromQuery(Name = "sort")] string sort = "PRJ_ORGCODE",
                                    [FromQuery(Name = "order")] string order = "desc",
                                    [FromQuery(Name = "search")] string search = "")
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
            string userid = claims.Where((c) => c.Type == "Id").FirstOrDefault().Value;
            string filter = "";


            string command = @$"SELECT
                                    TAF.ID AS form_id,
                                    TGBD.ID AS tgbd_id,
        	                        TAF.FORM_TYPE AS form_type,
	                                SS_FT.SPC_NAME1 AS form_type_text,
	                                TB.BRAND_ID AS brand_id,
	                                TB.BRAND_NAME AS brand_name,
	                                TB.BRAND_CATEGORY_ID AS brand_category_id,
	                                TC.CATEGORY_NAME AS brand_category_id_text,
	                                TBC.CLASSIFICATION_CODE AS classification_code,
	                                TIC.CLASS_NAME AS classification_code_text,
	                                IIF(TAF.FORM_TYPE != 4, TB.COMPANYCODE_POTENT,TBD.DETAIL_COMPANYCODE) AS companycode_owner,
	                                TCOM_OW.COMPANY_NAME AS companycode_owner_text,
	                                TBC.COUNTRY_ID AS country_id,
	                                TCOUN.COUNTRY_NAME AS country_text,
	                                TCOM_L.ID AS companycode_lisence,
	                                TCOM_L.COMPANY_NAME AS companycode_lisence_text,
	                                TBD.DOCUMENT_LISENCE AS document_lisence,
	                                TBD.DOCUMENT_DURATION AS document_duration,
	                                TBD.DOCUMENT_RIGHTS AS document_righths,
	                                TGBD.STARTDATE AS startdate,
	                                TGBD.FINISHDATE AS finishdate,
	                                TGBD.DATEDURATION_ID AS dateduration_id,
	                                SS_DATE.SPC_NAME1 AS dateduration_id_text,
	                                TGBD.CERTIFICATE_NUMBER AS certificate_number,
	                                TGBD.DOCUMENT_CERTIFICATE AS document_certificate,
	                                TGBD.DOCUMENT_EMAIL AS document_email,
	                                TGBD.CONFIRM_NOTE AS note
                                FROM TBL_BRANDS_DETAILS TBD
                                INNER JOIN TBL_BRANDS TB ON TBD.BRAND_ID = TB.ID AND BRAND_STATUS = 1
                                INNER JOIN TBL_APPLYING_FORMS TAF  ON TAF.ID = TBD.FORM_ID  AND TAF.FORM_STATUS = 4
                                INNER JOIN TBL_BRAND_CLASSIFICATIONS TBC ON TBD.ID = TBC.BRAND_DETAIL_ID  AND TBC.IS_SUCCEED = 1
                                INNER JOIN TBL_GET_BRAND_DETAIL TGBD ON TGBD.CLASSIFICATION_ID = TBC.ID
                                INNER JOIN TBL_CATEGORIES TC ON TC.ID = TB.BRAND_CATEGORY_ID
                                INNER JOIN TBL_INT_CLASSIFICATION TIC ON TIC.CLASS_CODE = TBC.CLASSIFICATION_CODE
                                LEFT JOIN TBL_COMPANIES TCOM_OW ON TCOM_OW.ID = IIF(TAF.FORM_TYPE != 4, TB.COMPANYCODE_POTENT,TBD.DETAIL_COMPANYCODE) AND TCOM_OW.STATUS=1
                                INNER JOIN TBL_COUNTRIES TCOUN ON TCOUN.ID = TBC.COUNTRY_ID
                                LEFT JOIN TBL_COMPANIES TCOM_L ON TBD.DETAIL_COMPANYCODE = TCOM_L.ID  AND TBD.FORM_TYPE = 3 AND TCOM_L.STATUS=1
                                INNER JOIN SYS_SPECODES SS_DATE ON SS_DATE.SPC_VALUEINT = TGBD.DATEDURATION_ID  AND SS_DATE.SPC_TYPE = 'RIGHTSDURATION'
                                INNER JOIN SYS_SPECODES SS_FT ON SS_FT.SPC_VALUEINT = TBD.FORM_TYPE  AND SS_FT.SPC_TYPE = 'FORMTYPE'
								{((!string.IsNullOrEmpty(search) || filter != "") ?
                                $@"WHERE TBD.DETAIL_STATUS = 1 {(filter == "" ? " AND " : (" AND " + filter + " AND "))}  
                                                                      (UPPER(TAF.FORM_NUMBER) LIKE UPPER(@SEARCH) 
                                                                    OR UPPER(TAF.FORM_CREATED_FULLNAME) LIKE UPPER(@SEARCH)
                                                                    OR UPPER(TAF.FORM_NOTE) LIKE UPPER(@SEARCH))" : "")}
                                ORDER BY TAF.ID  DESC
                                {(page != "0" ? "OFFSET @OFFSET ROWS FETCH NEXT @FETCH ROWS ONLY" : "")}";


            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@OFFSET", (Int32.Parse(page) - 1) * Int32.Parse(size));
            parameters.Add("@FETCH", Int32.Parse(size));
            parameters.Add("@SEARCH", $"%{search}%", DbType.String);


            List<Sourcebase> list = null;
            TableResponseModel<Sourcebase> trm = new TableResponseModel<Sourcebase>();
            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    list = connection.Query<Sourcebase>(command, parameters).ToList();
                    int totalcount = GetSourcebaseListCount(search);

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

        [HttpGet, Authorize]
        public int GetSourcebaseListCount([FromQuery(Name = "search")] string search = "")
        {
            string filter = "";

            string command = @$"SELECT
	                                COUNT(TB.BRAND_ID) AS COUNT
                                FROM TBL_BRANDS_DETAILS TBD
                                INNER JOIN TBL_BRANDS TB ON TBD.BRAND_ID = TB.ID AND BRAND_STATUS = 1
                                INNER JOIN TBL_APPLYING_FORMS TAF  ON TAF.ID = TBD.FORM_ID  AND TAF.FORM_STATUS = 4
                                INNER JOIN TBL_BRAND_CLASSIFICATIONS TBC ON TBD.ID = TBC.BRAND_DETAIL_ID  AND TBC.IS_SUCCEED = 1
                                INNER JOIN TBL_GET_BRAND_DETAIL TGBD ON TGBD.CLASSIFICATION_ID = TBC.ID
                                INNER JOIN TBL_CATEGORIES TC ON TC.ID = TB.BRAND_CATEGORY_ID
                                INNER JOIN TBL_INT_CLASSIFICATION TIC ON TIC.CLASS_CODE = TBC.CLASSIFICATION_CODE
                                LEFT JOIN TBL_COMPANIES TCOM_OW ON TCOM_OW.ID = IIF(TAF.FORM_TYPE != 4, TB.COMPANYCODE_POTENT,TBD.DETAIL_COMPANYCODE) AND TCOM_OW.STATUS=1
                                INNER JOIN TBL_COUNTRIES TCOUN ON TCOUN.ID = TBC.COUNTRY_ID
                                LEFT JOIN TBL_COMPANIES TCOM_L ON TBD.DETAIL_COMPANYCODE = TCOM_L.ID  AND TBD.FORM_TYPE = 3 AND TCOM_L.STATUS=1
                                INNER JOIN SYS_SPECODES SS_DATE ON SS_DATE.SPC_VALUEINT = TGBD.DATEDURATION_ID  AND SS_DATE.SPC_TYPE = 'RIGHTSDURATION'
                                INNER JOIN SYS_SPECODES SS_FT ON SS_FT.SPC_VALUEINT = TBD.FORM_TYPE  AND SS_FT.SPC_TYPE = 'FORMTYPE'
								{((!string.IsNullOrEmpty(search) || filter != "") ?
                                $@"WHERE TBD.DETAIL_STATUS = 1  {(filter == " AND " ? " AND " : (filter + " AND "))}  
                                                                      (UPPER(TAF.FORM_NUMBER) LIKE UPPER(@SEARCH) 
                                                                    OR UPPER(TAF.FORM_CREATED_FULLNAME) LIKE UPPER(@SEARCH)
                                                                    OR UPPER(TAF.FORM_NOTE) LIKE UPPER(@SEARCH))" : "")}";

            DynamicParameters parameters = new DynamicParameters();
            parameters.Add("@SEARCH", search);


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

        [HttpGet, Authorize]
        public IActionResult ExportSourcebaseList([FromQuery(Name = "page")] string page = "0",
                            [FromQuery(Name = "size")] string size = "10",
                            [FromQuery(Name = "sort")] string sort = "PRJ_ORGCODE",
                            [FromQuery(Name = "order")] string order = "desc",
                            [FromQuery(Name = "search")] string search = "")
        {
            IEnumerable<Claim> claims = (User.Identity as ClaimsIdentity).Claims;
            string userid = claims.Where((c) => c.Type == "Id").FirstOrDefault().Value;

            string command = @$"SELECT
                                    TAF.ID AS form_id,
                                    TGBD.ID AS tgbd_id,
        	                        TAF.FORM_TYPE AS form_type,
	                                SS_FT.SPC_NAME1 AS form_type_text,
	                                TB.BRAND_ID AS brand_id,
	                                TB.BRAND_NAME AS brand_name,
	                                TB.BRAND_CATEGORY_ID AS brand_category_id,
	                                TC.CATEGORY_NAME AS brand_category_id_text,
	                                TBC.CLASSIFICATION_CODE AS classification_code,
	                                TIC.CLASS_NAME AS classification_code_text,
	                                IIF(TAF.FORM_TYPE != 4, TB.COMPANYCODE_POTENT,TBD.DETAIL_COMPANYCODE) AS companycode_owner,
	                                TCOM_OW.COMPANY_NAME AS companycode_owner_text,
	                                TBC.COUNTRY_ID AS country_id,
	                                TCOUN.COUNTRY_NAME AS country_text,
	                                TCOM_L.ID AS companycode_lisence,
	                                TCOM_L.COMPANY_NAME AS companycode_lisence_text,
	                                TBD.DOCUMENT_LISENCE AS document_lisence,
	                                TBD.DOCUMENT_DURATION AS document_duration,
	                                TBD.DOCUMENT_RIGHTS AS document_righths,
	                                TGBD.STARTDATE AS startdate,
	                                TGBD.FINISHDATE AS finishdate,
	                                TGBD.DATEDURATION_ID AS dateduration_id,
	                                SS_DATE.SPC_NAME1 AS dateduration_id_text,
	                                TGBD.CERTIFICATE_NUMBER AS certificate_number,
	                                TGBD.DOCUMENT_CERTIFICATE AS document_certificate,
	                                TGBD.DOCUMENT_EMAIL AS document_email,
	                                TGBD.CONFIRM_NOTE AS note
                                FROM TBL_BRANDS_DETAILS TBD
                                INNER JOIN TBL_BRANDS TB ON TBD.BRAND_ID = TB.ID AND BRAND_STATUS = 1
                                INNER JOIN TBL_APPLYING_FORMS TAF  ON TAF.ID = TBD.FORM_ID  AND TAF.FORM_STATUS = 4
                                INNER JOIN TBL_BRAND_CLASSIFICATIONS TBC ON TBD.ID = TBC.BRAND_DETAIL_ID  AND TBC.IS_SUCCEED = 1
                                INNER JOIN TBL_GET_BRAND_DETAIL TGBD ON TGBD.CLASSIFICATION_ID = TBC.ID
                                INNER JOIN TBL_CATEGORIES TC ON TC.ID = TB.BRAND_CATEGORY_ID
                                INNER JOIN TBL_INT_CLASSIFICATION TIC ON TIC.CLASS_CODE = TBC.CLASSIFICATION_CODE
                                LEFT JOIN TBL_COMPANIES TCOM_OW ON TCOM_OW.ID = IIF(TAF.FORM_TYPE != 4, TB.COMPANYCODE_POTENT,TBD.DETAIL_COMPANYCODE) AND TCOM_OW.STATUS=1
                                INNER JOIN TBL_COUNTRIES TCOUN ON TCOUN.ID = TBC.COUNTRY_ID
                                LEFT JOIN TBL_COMPANIES TCOM_L ON TBD.DETAIL_COMPANYCODE = TCOM_L.ID  AND TBD.FORM_TYPE = 3 AND TCOM_L.STATUS=1
                                INNER JOIN SYS_SPECODES SS_DATE ON SS_DATE.SPC_VALUEINT = TGBD.DATEDURATION_ID  AND SS_DATE.SPC_TYPE = 'RIGHTSDURATION'
                                INNER JOIN SYS_SPECODES SS_FT ON SS_FT.SPC_VALUEINT = TBD.FORM_TYPE  AND SS_FT.SPC_TYPE = 'FORMTYPE'
                                WHERE TBD.DETAIL_STATUS = 1
                                ORDER BY TAF.ID  DESC";


            DynamicParameters parameters = new DynamicParameters();

            List<Sourcebase> list = null;
            using (IDbConnection connection = DbContext.GetConnection(DbContext.Types.TEST))
            {
                try
                {
                    list = connection.Query<Sourcebase>(command, parameters).ToList();
                }
                catch (Exception ex)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ex.Message);
                }
            }

            return Ok(list);
        }

    }
}
