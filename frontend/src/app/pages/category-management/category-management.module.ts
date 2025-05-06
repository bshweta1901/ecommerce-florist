import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryManagementRoutingModule } from './category-management-routing.module';
import { CategoryManagementComponent } from './category-management.component';;
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CommonTableModule } from '../common-table/common-table.module';
import { CommonModalModule } from '../common-modal/common-modal.module';
import { AddProductModule } from '../add-product/add-product.module';
import { SidebarModule } from 'primeng/sidebar';
import { AddCategoryManagementModule } from "../add-category-management/add-category-management.module";


@NgModule({
  declarations: [
    CategoryManagementComponent
  ],
  imports: [
    CommonModule,
    CategoryManagementRoutingModule,
    CommonModalModule,
    CommonTableModule,
    CategoryManagementRoutingModule,
    PaginatorModule,
    ButtonModule,
    DividerModule,

    SidebarModule,
    AddCategoryManagementModule
]
})
export class CategoryManagementModule { }
