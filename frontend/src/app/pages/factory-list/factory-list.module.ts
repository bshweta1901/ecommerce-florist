import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FactoryListRoutingModule } from './factory-list-routing.module';
import { FactoryListComponent } from './factory-list.component';
import { CommonTableModule } from '../common-table/common-table.module';
import { CommonModalModule } from '../common-modal/common-modal.module';
import { AddFactoryModule } from '../add-factory/add-factory.module';
import { DropdownModule } from 'primeng/dropdown';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';


@NgModule({
  declarations: [
    FactoryListComponent
  ],
  imports: [
    CommonModule,
    FactoryListRoutingModule,
    CommonTableModule,
    CommonModalModule,
    AddFactoryModule,
    DropdownModule,
    SidebarModule,
    ButtonModule,
  ]
})
export class FactoryListModule { }
