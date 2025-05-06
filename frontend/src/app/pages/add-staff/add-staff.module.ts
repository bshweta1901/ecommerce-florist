import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddStaffRoutingModule } from './add-staff-routing.module';
import { AddStaffComponent } from './add-staff.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { CustomValidationModule } from "../custom-validation/custom-validation.module";

@NgModule({
  declarations: [
    AddStaffComponent
  ],
  imports: [
    CommonModule,
    AddStaffRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    CustomValidationModule
],
  exports: [AddStaffComponent]
})
export class AddStaffModule { }
