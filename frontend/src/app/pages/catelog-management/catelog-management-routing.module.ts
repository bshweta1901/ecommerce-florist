import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatelogManagementComponent } from './catelog-management.component';

const routes: Routes = [{ path: '', component: CatelogManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatelogManagementRoutingModule { }
