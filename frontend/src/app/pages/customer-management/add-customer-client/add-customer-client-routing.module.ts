import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCustomerClientComponent } from './add-customer-client.component';

const routes: Routes = [{ path: '', component: AddCustomerClientComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCustomerClientRoutingModule { }
