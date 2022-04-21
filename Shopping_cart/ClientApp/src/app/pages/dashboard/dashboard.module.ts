import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CRUDTableModule } from 'src/app/modules/crud-table';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbButtonsModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
     DashboardRoutingModule,

     CRUDTableModule,
     NgSelectModule,
     FormsModule,
     ReactiveFormsModule,
     InlineSVGModule,
     NgbButtonsModule,
     NgbDatepickerModule
    ],
})
export class DashboardModule {}
