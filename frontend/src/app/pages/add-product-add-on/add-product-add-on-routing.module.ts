import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddProductAddOnComponent } from './add-product-add-on.component';

const routes: Routes = [{ path: '', component: AddProductAddOnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddProductAddOnRoutingModule { }
