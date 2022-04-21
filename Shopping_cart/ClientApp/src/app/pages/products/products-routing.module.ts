import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product_list/product_list.component';

const routes: Routes = [
  {
    path: 'product_list',
    children: [
      {
        path: '',
        component: ProductListComponent,
        data: { returnUrl: window.location.pathname },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
