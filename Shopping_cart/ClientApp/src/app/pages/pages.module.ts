import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DashboardModule,
    PagesRoutingModule,
  ],
})
export class PagesModule {}
