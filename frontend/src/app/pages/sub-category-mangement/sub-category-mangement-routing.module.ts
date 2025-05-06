import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubCategoryMangementComponent } from './sub-category-mangement.component';

const routes: Routes = [{ path: '', component: SubCategoryMangementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubCategoryMangementRoutingModule { }
