import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddCategoryManagementRoutingModule } from './add-category-management-routing.module';
import { AddCategoryManagementComponent } from './add-category-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AddCategoryManagementComponent
  ],
  imports: [
    CommonModule,
    AddCategoryManagementRoutingModule,
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
  exports: [AddCategoryManagementComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AddCategoryManagementModule { }
