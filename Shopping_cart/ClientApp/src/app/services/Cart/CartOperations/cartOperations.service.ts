import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GenericValues } from 'src/app/models/GenericValues.model';
import { SpeCodeList } from 'src/app/models/specodelist.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

const API_URL = `${environment.apiUrl}/CartOperations`;

@Injectable({
  providedIn: 'root',
})
export class CartOperationsService{

  constructor(private http: HttpClient) {}

  AddToCart(id: number) {
	  const url = `${API_URL}/AddToCart`;
	  const config = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

	  return this.http.post<any>(url, id, config);
  }

  RemoveFromCart(id: number) {
	  const url = `${API_URL}/RemoveFromCart`;
	  const config = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

	  return this.http.post<any>(url, id, config);
  }

  DecreaseQuantity(id: number) {
	  const url = `${API_URL}/DecreaseQuantity`;
	  const config = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

	  return this.http.post<any>(url, id, config);
  }

  increaseQuantity(id: number) {
	  const url = `${API_URL}/increaseQuantity`;
	  const config = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

	  return this.http.post<any>(url, id, config);
  }



}


