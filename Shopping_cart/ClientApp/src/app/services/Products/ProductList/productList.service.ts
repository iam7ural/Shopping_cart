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
import { Alert } from 'selenium-webdriver';
import { Products } from 'src/app/models/Products/products.model';

const API_URL = `${environment.apiUrl}/ProductsList`;

@Injectable({
  providedIn: 'root'
})
export class ProductListService extends TableService<Products> implements OnDestroy{
	usersCount: number = 0;

 constructor(@Inject(HttpClient) http) {
	  super(http);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  find(tableState: ITableState): Observable<TableResponseModel<Products>> {
    if (tableState.sorting.column === 'id')
      tableState.sorting.column = 'id';
    const url = `${API_URL}/GetProductsList`;

    const params: HttpParams = new HttpParams()
      .set('page', tableState.paginator.page.toString())
      .set('size', tableState.paginator.pageSize.toString())
      .set('sort', tableState.sorting.column)
      .set('order', tableState.sorting.direction)
      .set('search', tableState.searchTerm)
      .set(
        'category_id',
        tableState.filter['category_id'] === undefined
          ? '-1'
          : tableState.filter['category_id']
      )
      .set(
        'size_id',
        tableState.filter['size_id'] === undefined
          ? '-1'
          : tableState.filter['size_id']
      )
      .set(
        'color_id',
        tableState.filter['color_id'] === undefined
          ? '-1'
          : tableState.filter['color_id']
      )


    return this.http
      .get<GenericValues>(url, { params })
      .pipe(
        map((response: GenericValues) => {
          const result: TableResponseModel<Products> = {
            items: <Products[]>response.items,
            total: response.totalcount,
          };
          return result;
        })
      );
  }

  export(tableState: ITableState): Observable<Products[]> {
    if (tableState.sorting.column === 'id')
      tableState.sorting.column = 'ID';

    const url = `${API_URL}/GetCarsRegisterList`;

    const params: HttpParams = new HttpParams()
      .set('page', '0')
      .set('size', tableState.paginator.pageSize.toString())
      .set('sort', tableState.sorting.column)
      .set('order', tableState.sorting.direction)
      .set('search', tableState.searchTerm)

    return this.http.get<Products[]>(url, { params });
  }
}
