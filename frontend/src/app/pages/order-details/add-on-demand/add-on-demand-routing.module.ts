import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOnDemandComponent } from './add-on-demand.component';

const routes: Routes = [{ path: '', component: AddOnDemandComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddOnDemandRoutingModule { }
