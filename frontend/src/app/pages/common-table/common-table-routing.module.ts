import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonTableComponent } from './common-table.component';

const routes: Routes = [{ path: '', component: CommonTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonTableRoutingModule { }
