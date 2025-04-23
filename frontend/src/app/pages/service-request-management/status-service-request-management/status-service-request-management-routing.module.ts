import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusServiceRequestManagementComponent } from './status-service-request-management.component';

const routes: Routes = [{ path: '', component: StatusServiceRequestManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusServiceRequestManagementRoutingModule { }
