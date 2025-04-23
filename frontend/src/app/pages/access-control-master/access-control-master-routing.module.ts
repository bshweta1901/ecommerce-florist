import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessControlMasterComponent } from './access-control-master.component';

const routes: Routes = [{ path: '', component: AccessControlMasterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessControlMasterRoutingModule { }
