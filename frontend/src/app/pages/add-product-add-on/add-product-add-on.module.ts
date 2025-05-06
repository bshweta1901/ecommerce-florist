import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddProductAddOnRoutingModule } from './add-product-add-on-routing.module';
import { AddProductAddOnComponent } from './add-product-add-on.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    AddProductAddOnComponent
  ],
  imports: [
    CommonModule,
    AddProductAddOnRoutingModule,
    FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        CalendarModule
  ],
    exports: [AddProductAddOnComponent]
})
export class AddProductAddOnModule { }
