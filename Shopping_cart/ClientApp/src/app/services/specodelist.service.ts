import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpeCodeList } from '../models/specodelist.model';
import { map } from "rxjs/operators";

const API_SPECODELIST_URL = `${environment.apiUrl}/specodelist`;

@Injectable({
  providedIn: 'root'
})
export class SpeCodeListsService {

  constructor(private http: HttpClient) { }

  GetSpeCodeLists(
    spc_type:string
    ): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getspecodelists/${spc_type}`;

		return this.http.get<SpeCodeList>(url);
	}

  GetGatesWithEnterpriseID(id): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/GetGatesWithEnterpriseID/${id}`;

		return this.http.get<SpeCodeList>(url);
	}

  GetCompanies(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getcompanies`;

		return this.http.get<SpeCodeList>(url);
	}

  GetCompaniesWithCategoryID(id): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getcompanies/${id}`;

		return this.http.get<SpeCodeList>(url);
	}

  GetIntClassifications(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getintclassifications`;

		return this.http.get<SpeCodeList>(url);
	}

  GetIntSubClassifications(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getintsubclassifications`;

		return this.http.get<SpeCodeList>(url);
	}

  GetIntSubClassificationsWithClassID(classcode:string): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getintsubclassificationswithclassid/${classcode}`;
		return this.http.get<SpeCodeList>(url);
	}

  GetCountries(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getcountries`;
		return this.http.get<SpeCodeList>(url);
	}

  GetCategories(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getcategories`;
		return this.http.get<SpeCodeList>(url);
	}

  GetSizes(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/GetSizes`;
		return this.http.get<SpeCodeList>(url);
	}

  GetColors(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/GetColors`;
		return this.http.get<SpeCodeList>(url);
	}

  GetBrands(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getbrands`;
		return this.http.get<SpeCodeList>(url);
	}

  GetFormNumber(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/GetFormNumber`;

		return this.http.get<SpeCodeList>(url);
	}


  GetUsersWithSearching(str) : Observable<SpeCodeList[]> {
    let params = new HttpParams();
    params = params.append('str',String(str));

    let apiurl = `${API_SPECODELIST_URL}/getuserswithsearching`;
    return this.http.get<SpeCodeList[]>(apiurl,{params});
  }

  GetRoles(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getroles`;
		return this.http.get<SpeCodeList>(url);
	}


  GetEnterprises(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/GetEnterprises`;
		return this.http.get<SpeCodeList>(url);
	}

  GetCarTypes(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getcartypes`;
		return this.http.get<SpeCodeList>(url);
	}



  GetStatusTypes(): Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getstatustypes`;
    return this.http.get<SpeCodeList>(url);
  }

  GetPersonalStatusTypes() : Observable<SpeCodeList> {
    const url = `${API_SPECODELIST_URL}/getpersonalstatustypes`
    return this.http.get<SpeCodeList>(url);
  }
}
