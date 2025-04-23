import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceRequestManagementComponent } from './service-request-management.component';

const routes: Routes = [{ path: '', component: ServiceRequestManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRequestManagementRoutingModule { }
