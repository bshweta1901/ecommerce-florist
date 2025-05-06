import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryManagementComponent } from './add-category-management.component';

const routes: Routes = [{ path: '', component: AddCategoryManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCategoryManagementRoutingModule { }
