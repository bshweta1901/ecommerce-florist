import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubCategoryMangementRoutingModule } from './sub-category-mangement-routing.module';
import { SubCategoryMangementComponent } from './sub-category-mangement.component';
import { CommonModalModule } from '../common-modal/common-modal.module';
import { CommonTableModule } from '../common-table/common-table.module';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SidebarModule } from 'primeng/sidebar';
import { AddSubCategoryModule } from "../add-sub-category/add-sub-category.module";


@NgModule({
  declarations: [
    SubCategoryMangementComponent
  ],
  imports: [
    CommonModule,
    SubCategoryMangementRoutingModule,
    CommonModule,
    CommonModalModule,
    CommonTableModule,
    PaginatorModule,
    ButtonModule,
    DividerModule,
    SidebarModule,
    AddSubCategoryModule
]
})
export class SubCategoryMangementModule { }
