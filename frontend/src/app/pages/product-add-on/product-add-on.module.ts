import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAddOnRoutingModule } from './product-add-on-routing.module';
import { ProductAddOnComponent } from './product-add-on.component';

import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CommonTableModule } from '../common-table/common-table.module';
import { CommonModalModule } from '../common-modal/common-modal.module';
import { AddProductModule } from '../add-product/add-product.module';
import { SidebarModule } from 'primeng/sidebar';
import { AddProductAddOnModule } from '../add-product-add-on/add-product-add-on.module';



@NgModule({
  declarations: [
    ProductAddOnComponent
  ],
  imports: [
    CommonModule,
    ProductAddOnRoutingModule,
    PaginatorModule,
    ButtonModule,
    DividerModule,
    CommonTableModule,
    CommonModalModule,
    AddProductModule,
    SidebarModule,
    AddProductAddOnModule
],
  exports: [ ProductAddOnComponent ]
})
export class ProductAddOnModule { }
