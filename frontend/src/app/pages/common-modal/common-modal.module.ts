import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonModalRoutingModule } from './common-modal-routing.module';
import { CommonModalComponent } from './common-modal.component';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [
    CommonModalComponent
  ],
  imports: [
    CommonModule,
    CommonModalRoutingModule,
    DialogModule
  ],
  exports:[
    CommonModalComponent
  ]
})
export class CommonModalModule { }
