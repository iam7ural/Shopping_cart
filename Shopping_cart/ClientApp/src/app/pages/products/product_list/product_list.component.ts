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
import { SpeCodeListsService } from 'src/app/services/specodelist.service';
import { ProductListService } from 'src/app/services/Products/ProductList/productList.service';
import { CartOperationsService } from 'src/app/services/Cart/CartOperations/cartOperations.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product_list.component.html',
  styleUrls: ['./product_list.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ],
})
export class ProductListComponent
implements
    OnInit,
    OnDestroy,
    AfterViewInit,
    ISortView,
    IFilterView,
    ISearchView {
      categories:SpeCodeList;
      sizes:SpeCodeList;
      colors:SpeCodeList;

      paginator: PaginatorState;
      sorting: SortState;
      grouping: GroupingState;
      isLoading: boolean;
      filterGroup: FormGroup;
      searchGroup: FormGroup;
      searchTerm: string = '';

      private subscriptions: Subscription[] = [];
      exportDataExcel: any[] = [];

      isShow:boolean = false;

      constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        private subheaderService: SubheaderService,
        public tableService: ProductListService,
        public cartOperationsService: CartOperationsService,
        public specodelistsService: SpeCodeListsService,
        private router: Router,
      ) {

        this.specodelistsService.GetCategories().subscribe(data=>{
          this.categories = data;
        });

        this.specodelistsService.GetSizes().subscribe(data=>{
          this.sizes = data;
        });

        this.specodelistsService.GetColors().subscribe(data=>{
          this.colors = data;
        });


        this.subscriptions.push(
          this.subheaderService.getToggleFilterEvent().subscribe(() => {
            this.toggleFilter();
          })
        );


        this.subscriptions.push(
          this.subheaderService.getSearchEvent().subscribe((data) => {
            this.search(data);
          })
        );
      }



  filterForm() {
    this.filterGroup = this.fb.group({
      category_id: ['-1'],
      size_id: ['-1'],
      color_id: ['-1'],
    });

    this.subscriptions.push(
      this.filterGroup.controls.category_id.valueChanges.subscribe(() =>
        this.filter()
      )
    );

    this.subscriptions.push(
      this.filterGroup.controls.size_id.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.color_id.valueChanges.subscribe(() =>
        this.filter()
      )
    );
  }

  filter() {
    const filter = {};
    const category_id = this.filterGroup.get('category_id').value;
    const size_id = this.filterGroup.get('size_id').value;
    const color_id = this.filterGroup.get('color_id').value;

    if (category_id) {
      filter['category_id'] = category_id;
    }
    if (size_id) {
       filter['size_id'] = size_id;
     }
     if (color_id) {
       filter['color_id'] = color_id;
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




      AddToCart(product_id){
        this.cartOperationsService.AddToCart(product_id).subscribe(
          data => {
            Swal.fire({
              title:"ITEM WAS ADDED",
              icon: "success"
            });
          },
          error =>{
            Swal.fire({
              title:"Xəta!",
              text: error,
              icon: "error"
            });
          }
        );
      }


      toggleFilter() {
        var aElement = document.getElementById("filterpanel");

        this.isShow = !this.isShow;
        if (this.isShow == true) {
          aElement.setAttribute("hidden", "true");
        }
        else{
          aElement.removeAttribute("hidden");
        }
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
        this.subheaderService.setTitle('PRODUCTS');
        this.subheaderService.setAddButton({ Show: false, Title: 'Əlavə et' });
        this.subheaderService.setToggleFilterButton({Show: true, Title: 'Filter'});
        this.subheaderService.setExportButton({ Show: false, Title: 'Export' });
        this.subheaderService.setSearchInput({ Show: true });

      }
    }
