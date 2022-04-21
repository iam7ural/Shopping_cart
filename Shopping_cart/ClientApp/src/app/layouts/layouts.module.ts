import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDropdownModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../modules/i18n/translation.module';
import { LayoutComponent } from './layout.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ScriptsInitComponent } from './scripts-init.component';
import { SubheaderModule } from './subheader/subheader.module';
import { HeaderModule } from './header/header.module';
import { ScrollTopComponent } from './extras/scroll-top/scroll-top.component';
import { PagesRoutingModule } from '../pages/pages-routing.module';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderMobileComponent,
    SidebarComponent,
    FooterComponent,
    ScriptsInitComponent,
    ScrollTopComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PagesRoutingModule,
    TranslationModule,
    InlineSVGModule,
    SubheaderModule,
    HeaderModule,
    NgbDropdownModule,
    NgbProgressbarModule,
  ],
})
export class LayoutsModule { }
