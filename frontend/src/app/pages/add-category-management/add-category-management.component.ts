import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormControl, FormGroup, Validators } from '@angular/forms';

import { DocumentMaster } from 'src/app/model/DocumentMaster.model'; // Ensure this path is correct
import { CategoryMaster } from 'src/app/model/CategoryMaster.model';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast'; // also needed for <p-toast />
import { MessageService } from 'primeng/api';
import { CategoryService } from 'src/app/service/category.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-add-category-management',
  templateUrl: './add-category-management.component.html',
  styleUrls: ['./add-category-management.component.scss'],
  providers: [MessageService]


})
export class AddCategoryManagementComponent implements OnInit {
  addCategoryForm: FormGroup;
  category:CategoryMaster = new CategoryMaster();
  imageError: boolean = false;
  isLoading: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  @Input() hideButton: boolean;
  @Input() eventData: CategoryMaster;
  @Output() saveEvents: EventEmitter<any> = new EventEmitter();
  uploadedFile: File | null = null;
  msg: string;


  constructor(private messageService: MessageService,private categoryService:CategoryService,private sweetAlertService:SweetAlertService) { }


  ngOnInit(): void {
    this.addCategoryForm = new FormGroup({
      name: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      description: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      category_img: new FormControl(null),
    });
  
    if (this.eventData) {
      this.category = this.eventData;
  
      this.addCategoryForm.patchValue({
        name: this.category.name,
        description: this.category.description,
        category_img: this.category.category_img
      });
    }
  }
  
  onImageUpload(event: any) {
    const file: File = event.files[0];
    this.uploadedFile=file
    // Optional: If you're handling manual upload
    // You can call your API here to upload the file
  }

  removeImage(): void {
    // debugger;
    this.category.category_img_path = null;
    this.uploadedFile = null;
    this.addCategoryForm.patchValue({ category_img: null });
  }
  
  onImageSelect(event: any): void {
    const file: File = event.files[0]; // Fix: access event.files
    if (file && file.type.startsWith('image/')) {
      this.imageError = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.category.category_img = { file_path: e.target.result } as any; // Make sure category_img is defined
        this.addCategoryForm.patchValue({
          category_img: this.category.category_img
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.imageError = true;
    }
  }
  
  leadingSpaceValidator(control) {
    const value = control.value;
    if (value && (value.trimLeft() !== value || value.trim() === '')) {
      if (value.trimLeft() !== value) {
        return { leadingSpace: true };
      } else {
        return { onlySpaces: true };
      }
    }
    return null;
  }
  saveCategory(): void {
    // debugger;
    this.categoryService.saveCategory(this.category.toJSON(),this.uploadedFile).subscribe(
          (data) => {
            //console.log(data,"data");
            this.sweetAlertService.successAlert(
              "Category has been added successfully"
            );
            this.saveEvents.emit();
          },
          (err: HttpErrorResponse) => {
            
            if (err.status === 200) {
              let jsonString = err.error.text;
              jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
            }else if(err.status === 400){
              console.log(err.error.error.message,'msg');
              let jsonString = err;
              this.msg = jsonString.error.error.message;
              this.sweetAlertService.errorAlert(
                this.msg
              );
              this.saveEvents.emit();
            }
          }
        );
    if (this.addCategoryForm.valid) {
      this.isLoading = true;
      // Call your service to save the category
      console.log(this.category);
      this.isLoading = false;
    }
  }
  onBasicUploadAuto(event: any) {
    this.uploadedFile = event.files[0];
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
}
  updateCategory(): void {
    this.category.category_img=null
    this.category = new CategoryMaster(this.category); // Rehydrate to include methods

    this.categoryService.updateCategory(this.category.toJSON(),this.uploadedFile).subscribe(
      (data) => {
        //console.log(data,"data");
        this.sweetAlertService.successAlert(
          "Category has been added successfully"
        );
        this.saveEvents.emit();
      },
      (err: HttpErrorResponse) => {
        
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        }else if(err.status === 400){
          console.log(err.error.error.message,'msg');
          let jsonString = err;
          this.msg = jsonString.error.error.message;
          this.sweetAlertService.errorAlert(
            this.msg
          );
          this.saveEvents.emit();
        }
      }
    );
if (this.addCategoryForm.valid) {
  this.isLoading = true;
  // Call your service to save the category
  console.log(this.category);
  this.isLoading = false;
}
  }

}
