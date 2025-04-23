import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddFactoryRoutingModule } from './add-factory-routing.module';
import { AddFactoryComponent } from './add-factory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CustomValidationModule } from '../custom-validation/custom-validation.module';


@NgModule({
  declarations: [
    AddFactoryComponent
  ],
  imports: [
    CommonModule,
    AddFactoryRoutingModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
    InputTextareaModule,
    ButtonModule,
    DropdownModule,
    CustomValidationModule
  ],
  exports: [
    AddFactoryComponent
  ]
})
export class AddFactoryModule { }
