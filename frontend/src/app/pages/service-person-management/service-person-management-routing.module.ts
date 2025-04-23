import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicePersonManagementComponent } from './service-person-management.component';

const routes: Routes = [{ path: '', component: ServicePersonManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicePersonManagementRoutingModule { }
