import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import { GenericValues } from '../../../models/GenericValues.model';
import {
	ITableState,
	TableResponseModel,
	TableService,
  } from '../../../modules/crud-table';
import { SpeCodeList } from 'src/app/models/specodelist.model';
import { CartDetail } from 'src/app/models/Cart/cartDetail.model';

const API_URL = `${environment.apiUrl}/CartDetailList`;

@Injectable({
  providedIn: 'root'
})
export class CartDetailListService extends TableService<CartDetail> implements OnDestroy{
	usersCount: number = 0;

 constructor(@Inject(HttpClient) http) {
	  super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  find(tableState: ITableState): Observable<TableResponseModel<CartDetail>> {
    if (tableState.sorting.column === 'id')
      tableState.sorting.column = 'ID';
    const url = `${API_URL}/GetCartDetailList`;

    const params: HttpParams = new HttpParams()
      .set('page', tableState.paginator.page.toString())
      .set('size', tableState.paginator.pageSize.toString())
      .set('sort', tableState.sorting.column)
      .set('order', tableState.sorting.direction)
      .set('search', tableState.searchTerm)

    return this.http
      .get<GenericValues>(url, { params })
      .pipe(
        map((response: GenericValues) => {
          const result: TableResponseModel<CartDetail> = {
            items: <CartDetail[]>response.items,
            total: response.totalcount,
          };
          return result;
        })
      );
  }

  export(tableState: ITableState): Observable<CartDetail[]> {
    if (tableState.sorting.column === 'id')
      tableState.sorting.column = 'ID';

    const url = `${API_URL}/GetGatesList`;

    const params: HttpParams = new HttpParams()
      .set('page', '0')
      .set('size', tableState.paginator.pageSize.toString())
      .set('sort', tableState.sorting.column)
      .set('order', tableState.sorting.direction)
      .set('search', tableState.searchTerm)

    return this.http.get<CartDetail[]>(url, { params });
  }
}
