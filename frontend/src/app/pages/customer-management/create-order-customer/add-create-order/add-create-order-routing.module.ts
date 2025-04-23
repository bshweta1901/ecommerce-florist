import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCreateOrderComponent } from './add-create-order.component';

const routes: Routes = [{ path: '', component: AddCreateOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCreateOrderRoutingModule { }
