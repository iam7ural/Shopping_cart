import { BaseModel } from "../modules/crud-table";

export class Item implements BaseModel{
    ID: number;          
    itM_CODE?: string;       
    itM_NAME?: string; 
    itM_DEFINITION?: string;  
    itM_IGRID?: number; 
    igR_NAME?: string;  
    itM_MARKA?: string;  
    itM_MODEL?: string;  
    itM_SPECODE?: string;  
    itM_UNITCOST?: number; 
    itM_CNVCOST1?: number;  
    itM_CNVCOST2?:number 
    itM_UNITCOUNT?: number; 
    itM_CNVCOUNT1?: number; 
    itM_CNVCOUNT2?: number; 
    itM_UNITPURCH?: number; 
    itM_CNVPURCH1?: number; 
    itM_CNVPURCH2?: number; 
    itM_UNITREPORT?: number; 
    itM_CNVREPORT1?: number; 
    itM_CNVREPORT2?: number; 
    itM_NOTE?: string;  
    itM_STATUS?: number;
}