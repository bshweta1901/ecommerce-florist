import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSparePartRequestComponent } from './add-spare-part-request.component';

const routes: Routes = [{ path: '', component: AddSparePartRequestComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSparePartRequestRoutingModule { }
