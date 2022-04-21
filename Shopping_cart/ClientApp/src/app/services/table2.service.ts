import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import {
    BaseModel,
    Cell,
    GroupingState,
    ITableState,
    PaginatorState,
    SortState,
    TableResponseModel,
  } from '../../app/modules/crud-table';

const DEFAULT_STATE: ITableState = {
  filter: { status: '-1' },
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',

  grouping: new GroupingState(),
  entityId: 0,
};

@Injectable({
  providedIn: 'any',
})
export class Table2Service<T> {
  private _items$ = new BehaviorSubject<T[]>([]);
  private _colums$ = new BehaviorSubject<Cell[]>([]);
  private _footer$ = new BehaviorSubject<Cell[]>([]);

  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  API_URL: string = '';

  get items$() {
    return this._items$.asObservable();
  }
  get columns$() {
    return this._colums$.asObservable();
  }
  get footer$() {
    return this._footer$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }

  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }

  get grouping() {
    return this._tableState$.value.grouping;
  }

  constructor(public http: HttpClient) {
    this.setDefaults();
  }

  find(tableState: ITableState): Observable<TableResponseModel<T>> {
    const config = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    };
    return this.http.post<any>(this.API_URL, tableState, config).pipe(
      map((response) => {
        const result: TableResponseModel<T> = {
          items: response.items,
          total: response.total,
        };
        return result;
      }),
      catchError((err) => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  public fetch() {
    //start my code for disabled filter
    var el = document.getElementsByClassName("form-control");
    for (let i = 0; i < el.length; i++) {
      el[i].setAttribute("disabled", "true");
    }
    //end of my code for disabled filter

    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: TableResponseModel<T>) => {

          this._items$.next(res.items);

          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0,
          });
        }),
        finalize(() => {
          //start my code for enabled filter
          var el = document.getElementsByClassName("form-control");
          for (let i = 0; i < el.length; i++) {
            el[i].removeAttribute("disabled");
          }
          //end of my code for enabled filter

          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = el as unknown as BaseModel;
            return item.ID;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: { status: `1` } });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });

    this.patchStateWithoutFetch({
      paginator: new PaginatorState(),
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public getState() {
    return this._tableState$;
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }
}
