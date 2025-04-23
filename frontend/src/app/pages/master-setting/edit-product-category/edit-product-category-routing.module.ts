import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditProductCategoryComponent } from './edit-product-category.component';

const routes: Routes = [{ path: '', component: EditProductCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditProductCategoryRoutingModule { }
