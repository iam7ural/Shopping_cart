import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { HeaderMenuDynamicComponent } from './header-menu/header-menu.component';
import { TopbarModule } from './topbar/topbar.module';

@NgModule({
  declarations: [HeaderComponent,HeaderMenuDynamicComponent],
  imports: [
    CommonModule,
    TopbarModule
  ],
  exports: [HeaderComponent],
})
export class HeaderModule { }
