import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddSubCategoryRoutingModule } from './add-sub-category-routing.module';
import { AddSubCategoryComponent } from './add-sub-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  declarations: [
    AddSubCategoryComponent
  ],
  imports: [
    CommonModule,
    AddSubCategoryRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        CalendarModule,
        ToastModule,
        FileUploadModule, // ✅ ONLY FileUploadModule
  ],
    providers: [
      MessageService  // ✅ ADD THIS LINE
    ],
    exports: [AddSubCategoryComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AddSubCategoryModule { }
