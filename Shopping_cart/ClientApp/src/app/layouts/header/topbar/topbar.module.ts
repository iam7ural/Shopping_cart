import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar.component';
import { NgbDatepicker, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { ExtrasModule } from '../../extras/extras.module';
import { InlineSVGModule } from 'ng-inline-svg';

@NgModule({
  declarations: [
    TopbarComponent,
    LanguageSelectorComponent
  ],
  imports: [
    CommonModule,
    NgbDropdownModule,
    ExtrasModule,
    InlineSVGModule,
  ],
  exports: [TopbarComponent],
})
export class TopbarModule { }
