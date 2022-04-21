import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMenusModule } from '../extras/dropdown-menus/dropdown-menus.module';
import { SubheaderComponent } from './subheader.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SubheaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    InlineSVGModule,
    NgbDropdownModule,
    DropdownMenusModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SubheaderComponent],
})
export class SubheaderModule { }
