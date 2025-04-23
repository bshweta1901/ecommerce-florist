import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginationRoutingModule } from './pagination-routing.module';
import { PaginationComponent } from './pagination.component';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';


@NgModule({
  declarations: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    PaginationRoutingModule,
    PaginatorModule,
    ButtonModule,
    DividerModule
  ]
})
export class PaginationModule { }
