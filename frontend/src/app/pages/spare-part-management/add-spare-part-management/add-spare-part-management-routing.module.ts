import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSparePartManagementComponent } from './add-spare-part-management.component';

const routes: Routes = [{ path: '', component: AddSparePartManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSparePartManagementRoutingModule { }
