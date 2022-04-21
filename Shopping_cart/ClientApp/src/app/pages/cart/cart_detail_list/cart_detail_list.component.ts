import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { SubheaderService } from 'src/app/services/subheader.service';
import Swal from "sweetalert2";
import {
  GroupingState,
  PaginatorState,
  SortState,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  ISortView,
  IFilterView,
  ISearchView,
} from '../../../modules/crud-table';
import { FormBuilder, FormGroup, NgSelectOption } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/utils/date-picker.utils';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SpeCodeList } from 'src/app/models/specodelist.model';
import { UserAccessService } from 'src/app/services/useraccess.service';
import { SpeCodeListsService } from 'src/app/services/specodelist.service';
import { CartDetailListService } from 'src/app/services/Cart/CartDetailList/cartDetailList.service';
import { CartOperationsService } from 'src/app/services/Cart/CartOperations/cartOperations.service';


@Component({
  selector: 'app-cart-detail_list',
  templateUrl: './cart_detail_list.component.html',
  styleUrls: ['./cart_detail_list.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ],
})
export class CartDetailListComponent
implements
    OnInit,
    OnDestroy,
    AfterViewInit,
    IDeleteAction,
    ISortView,
    IFilterView,
    ISearchView {
      paginator: PaginatorState;
      sorting: SortState;
      grouping: GroupingState;
      isLoading: boolean;
      filterGroup: FormGroup;
      searchGroup: FormGroup;
      searchTerm: string = '';

      private subscriptions: Subscription[] = [];

      constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private subheaderService: SubheaderService,
        public tableService: CartDetailListService,
        public operationsService: CartOperationsService,
        public specodelistsService: SpeCodeListsService,
        private router: Router,
        private userAccessService: UserAccessService,
      ) {
        this.subscriptions.push(
          this.subheaderService.getSearchEvent().subscribe((data) => {
            this.search(data);
          })
        );
      }


      filterForm() {
        this.filterGroup = this.fb.group({
          status: ['-1'],
        });

    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
  }

  filter() {
    const filter = {};
    const status = this.filterGroup.get('status').value;

     if (status) {
       filter['status'] = status;
     }
    this.tableService.patchState({ filter });
  }


      searchForm(): void {
        throw new Error('Method not implemented.');
      }

      search(searchTerm: string): void {
        this.searchTerm = searchTerm;
        this.tableService.patchState({ searchTerm });
      }

      sort(column: string): void {
        const sorting = this.sorting;
        const isActiveColumn = sorting.column === column;
        if (!isActiveColumn) {
          sorting.column = column;
          sorting.direction = 'asc';
        } else {
          sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
        }
        this.tableService.patchState({ sorting });
      }

      delete(id: number) {
        Swal.fire({
          title: ' Are you sure?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            this.operationsService.RemoveFromCart(id).subscribe((data) => {
              Swal.fire('Deleted!');
              this.filterForm();
              this.tableService.fetch();
            });
          }
        });
      }

      increaseQuantity(id: number){
        this.operationsService.increaseQuantity(id).subscribe((data) => {
          Swal.fire('Quantity was increased!');
          this.filterForm();
          this.tableService.fetch();
        });
      }

      decreaseQuantity(id: number){
        this.operationsService.DecreaseQuantity(id).subscribe(
          (data) => {
          Swal.fire('Quantity was increased!');
          this.filterForm();
          this.tableService.fetch();
        });
      }



      paginate(paginator: PaginatorState) {
        this.tableService.patchState({ paginator });
      }

      ngOnInit(): void {
        this.fillTable();
      }

      fillTable() {
        this.filterForm();
        this.tableService.fetch();
        this.grouping = this.tableService.grouping;
        this.paginator = this.tableService.paginator;
        this.sorting = this.tableService.sorting;
        const sb = this.tableService.isLoading$.subscribe(
          (res) => (this.isLoading = res)
        );
        this.subscriptions.push(sb);
      }

      ngOnDestroy(): void {
        this.tableService.subscriptions.forEach((sb) => sb.unsubscribe());
        this.subscriptions.forEach((sb) => sb.unsubscribe());
      }

      ngAfterViewInit(): void {
        this.subheaderService.setTitle('CART');
        this.subheaderService.setAddButton({ Show: false, Title: 'Add' });
        this.subheaderService.setToggleFilterButton({Show: false, Title: 'Filter'});
        this.subheaderService.setExportButton({ Show: false, Title: 'Export' });
        this.subheaderService.setSearchInput({ Show: true });
        this.subheaderService.setCheckButton({ Show: false, Title: 'Check' });
      }
    }
