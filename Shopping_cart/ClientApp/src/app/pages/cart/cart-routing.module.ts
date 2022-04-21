import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartDetailListComponent } from './cart_detail_list/cart_detail_list.component';

const routes: Routes = [
  {
    path: 'cart_detail_list',
    children: [
      {
        path: '',
        component: CartDetailListComponent,
        data: { returnUrl: window.location.pathname },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
