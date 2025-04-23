import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddServicePersonManagementComponent } from './add-service-person-management.component';

const routes: Routes = [{ path: '', component: AddServicePersonManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddServicePersonManagementRoutingModule { }
