import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModalComponent } from './common-modal.component';

const routes: Routes = [{ path: '', component: CommonModalComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonModalRoutingModule { }
