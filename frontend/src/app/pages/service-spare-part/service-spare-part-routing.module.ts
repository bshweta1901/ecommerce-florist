import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceSparePartComponent } from './service-spare-part.component';

const routes: Routes = [{ path: '', component: ServiceSparePartComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceSparePartRoutingModule { }
