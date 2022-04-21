import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbButtonsModule,NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CRUDTableModule } from 'src/app/modules/crud-table';
import { CartRoutingModule } from './cart-routing.module';
import { CartDetailListComponent } from './cart_detail_list/cart_detail_list.component';


@NgModule({
  declarations: [
    CartDetailListComponent,
  ],
  imports: [
    CommonModule,
    CRUDTableModule,
    CartRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbButtonsModule,
    NgbDatepickerModule
  ],
})
export class CartModule {}
