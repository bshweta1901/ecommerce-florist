import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterSettingComponent } from './master-setting.component';

const routes: Routes = [{ path: '', component: MasterSettingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterSettingRoutingModule { }
