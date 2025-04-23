import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffListRoutingModule } from './staff-list-routing.module';
import { StaffListComponent } from './staff-list.component';
import { CommonTableModule } from '../common-table/common-table.module';
import { CommonModalModule } from '../common-modal/common-modal.module';
import { AddStaffModule } from '../add-staff/add-staff.module';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    StaffListComponent
  ],
  imports: [
    CommonModule,
    StaffListRoutingModule,
    CommonTableModule,
    CommonModalModule,
    AddStaffModule,
    SidebarModule,
    ButtonModule
  ],
  exports: [ StaffListComponent ]
})
export class StaffListModule { }
