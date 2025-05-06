import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAddOnComponent } from './product-add-on.component';

const routes: Routes = [{ path: '', component: ProductAddOnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAddOnRoutingModule { }
