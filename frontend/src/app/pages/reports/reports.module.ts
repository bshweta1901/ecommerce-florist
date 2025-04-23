import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { CommonModalModule } from '../common-modal/common-modal.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CommonModalModule,
    CommonTableModule,
    TabViewModule,
    CalendarModule,
    FormsModule,
    DropdownModule
  ]
})
export class ReportsModule { }
