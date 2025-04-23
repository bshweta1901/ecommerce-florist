import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCatelogManagementComponent } from './add-catelog-management.component';

const routes: Routes = [{ path: '', component: AddCatelogManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCatelogManagementRoutingModule { }
