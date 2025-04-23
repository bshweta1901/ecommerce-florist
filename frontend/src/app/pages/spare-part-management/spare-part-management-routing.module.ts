import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SparePartManagementComponent } from './spare-part-management.component';

const routes: Routes = [{ path: '', component: SparePartManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SparePartManagementRoutingModule { }
