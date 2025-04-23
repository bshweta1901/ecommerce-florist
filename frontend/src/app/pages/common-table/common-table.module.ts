import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonTableRoutingModule } from './common-table-routing.module';
import { CommonTableComponent } from './common-table.component';
import { TableModule } from 'primeng/table';
import { CustomerService } from '../../service/customerservice';
import { ButtonModule } from 'primeng/button';
import {AppBreadcrumbService} from '../../app.breadcrumb.service';
import {ProductService} from '../../demo/service/productservice';
import {ConfirmationService, MessageService} from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from "primeng/paginator";
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import {SidebarModule} from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    CommonTableComponent
  ],
  imports: [
    CommonModule,
    CommonTableRoutingModule,
    TableModule,
    ButtonModule,
    ToolbarModule,
    ToastModule,
    DialogModule,
    PaginatorModule,
    OverlayPanelModule,
    CheckboxModule,
    SidebarModule,
    CalendarModule,
    InputTextModule
  ],
  exports: [CommonTableComponent],
  providers: [CustomerService,AppBreadcrumbService,ProductService,ConfirmationService, MessageService]
})
export class CommonTableModule { }
