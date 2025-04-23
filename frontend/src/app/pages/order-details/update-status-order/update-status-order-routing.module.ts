import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UpdateStatusOrderComponent } from './update-status-order.component';

const routes: Routes = [{ path: '', component: UpdateStatusOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateStatusOrderRoutingModule { }
