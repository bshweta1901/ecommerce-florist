import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerManagmentRoutingModule } from './banner-managment-routing.module';
import { BannerManagmentComponent } from './banner-managment.component';


@NgModule({
  declarations: [
    BannerManagmentComponent
  ],
  imports: [
    CommonModule,
    BannerManagmentRoutingModule
  ]
})
export class BannerManagmentModule { }
