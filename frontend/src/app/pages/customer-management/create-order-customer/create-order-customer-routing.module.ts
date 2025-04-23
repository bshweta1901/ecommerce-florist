import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrderCustomerComponent } from './create-order-customer.component';

const routes: Routes = [{ path: '', component: CreateOrderCustomerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateOrderCustomerRoutingModule { }
