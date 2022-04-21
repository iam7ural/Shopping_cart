import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbButtonsModule,NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CRUDTableModule } from 'src/app/modules/crud-table';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product_list/product_list.component';


@NgModule({
  declarations: [
    ProductListComponent,
  ],
  imports: [
    CommonModule,
    CRUDTableModule,
    ProductsRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbButtonsModule,
    NgbDatepickerModule
  ],
})
export class ProductsModule {}
