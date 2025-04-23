import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomValidationRoutingModule } from './custom-validation-routing.module';
import { CustomValidationComponent } from './custom-validation.component';


@NgModule({
  declarations: [
    CustomValidationComponent
  ],
  imports: [
    CommonModule,
    CustomValidationRoutingModule
  ],
  exports:[
    CustomValidationComponent
  ]
})
export class CustomValidationModule { }
