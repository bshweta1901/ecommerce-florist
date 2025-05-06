import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerManagmentComponent } from './banner-managment.component';

const routes: Routes = [{ path: '', component: BannerManagmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerManagmentRoutingModule { }
