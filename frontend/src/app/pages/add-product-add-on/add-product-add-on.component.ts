import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CategoryMaster } from 'src/app/model/CategoryMaster.model';
import { GiveAwayMaster } from 'src/app/model/GiveAwayMaster.model';
import { PredefinedMaster } from 'src/app/model/PredefinedMaster.model';
import { ProductMaster } from 'src/app/model/ProductMaster.model';
import { SubCategoryMaster } from 'src/app/model/SubCategoryMaster.model';
import { CategoryService } from 'src/app/service/category.service';
import { PredefinedService } from 'src/app/service/predefined.service';
import { ProductService } from 'src/app/service/product.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';



export function offerPriceValidator(form: AbstractControl): ValidationErrors | null {
  const price = form.get('price')?.value;
  const offerPrice = form.get('offer_price')?.value;

  if (price != null && offerPrice != null && offerPrice > price) {
    return { invalidOfferPrice: true };
  }

  return null;
}

@Component({
  selector: 'app-add-product-add-on',
  templateUrl: './add-product-add-on.component.html',
  styleUrls: ['./add-product-add-on.component.scss']
})
export class AddProductAddOnComponent implements OnInit {


  addProductForm:FormGroup;
    categoryList:any[];
    subCategoryList:any[];
  
    commodityList:any[];
    fatList:any[];
    removedImageIds: number[] = [];
    itemList:any[];
    product:ProductMaster = new ProductMaster();
    @Output() close = new EventEmitter<boolean>();
    @Input() hideButton: boolean;
    @Input() eventData: ProductMaster;
    isLoading: boolean = false;
    roleList:any[];
    errorBean: any = {};
    @Output() saveEvents: EventEmitter<any> = new EventEmitter();
    msg: string;
    productStatusList:any[];
    factoryList:any[];
    rangeDates: Date[];
    @ViewChild('calendar') private calendar: any;
    minDate: Date;
    maxDate: Date;
    giveAwayList:GiveAwayMaster[]=[];
    giveAway:GiveAwayMaster = new GiveAwayMaster();
    lastThreeDigits:string;
    weightstd:any;
    countryList:PredefinedMaster[]=[];
    selectedImages: { file: File, preview: string }[] = [];

    constructor( private categoryService:CategoryService, private predefinedService:PredefinedService, private productService:ProductService, private sweetAlertService:SweetAlertService) { }


  ngOnInit(): void {

    this.addProductForm = new FormGroup({
          name: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
          description: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
          short_description: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
          sku: new FormControl("", [Validators.required]),
          product_status:new FormControl("", [Validators.required]),
          category: new FormControl(null),
          price: new FormControl(null),
          offer_price: new FormControl(null),
          sub_category: new FormControl(null),
        }, offerPriceValidator);  // 👈 apply the group-level validator here
        console.log("product..",this.product)
      
        if (this.eventData) {
          this.product = this.eventData;
      
          this.addProductForm.patchValue({
            name: this.product.name,
            description: this.product.description,
            // category_img: this.product.category_img
          });
        }
        if (this.product.category) {
          this.getSubCategoryList(this.product.category);  // This will set subcategory correctly inside
        }
        console.log("eventData..",this.product)
        this.getCategoryList();
        this.getProductStatusList();
  }


    onImageSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        Array.from(input.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.selectedImages.push({ file, preview: e.target.result });
          };
          reader.readAsDataURL(file);
        });
      }
    }
    
    removeSelectedImage(index: number) {
      
      this.selectedImages.splice(index, 1);
    }
    
    removeExistingImage(index: number) {
      // debugger;
      const removedImage = this.product.product_images[index];
    if (removedImage && removedImage.id) {
      this.removedImageIds.push(removedImage.id);  // Track removed image ID
    }
    this.product.product_images.splice(index, 1); // Remove from display
    }
  onCategoryChange(categoryId: string | number) {
    // debugger;
    // Call API or filter subcategories here
    this.getSubCategoryList(categoryId);
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
  
    keyPressForName(event:any) {
  
      var inp = String.fromCharCode(event.keyCode);
  
      if (/[a-zA-Z '.]/.test(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  
    keyAplhaNumeric(event:any) {
  
      var inp = String.fromCharCode(event.keyCode);
  
      if (/[a-zA-Z0-9 -,_./&()]/.test(inp) && !['*', '!', '%','$'].includes(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  
    keyNumeric(event:any) {
  
      var inp = String.fromCharCode(event.keyCode);
  
      if (/[0-9 -.]/.test(inp) && !['*', '!','$'].includes(inp)) {
        return true;
      } else {
        event.preventDefault();
        return false;
      }
    }
  
  
    saveProduct(): void
    {
      const defaultImageEntry = this.selectedImages.find(i => i.file);
      const defaultImage = defaultImageEntry.file;
      this.product.category_id=this.product.category.id;
      this.product.sub_category_id=this.product.sub_category.id;
      this.product.product_status_id=this.product.product_status.id;
      this.product.is_add_on=true
      this.productService.saveProduct(this.product,defaultImage).subscribe(
        (data) => {
          //console.log(data,"data");
          this.sweetAlertService.successAlert(
            "Product has been added successfully"
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
    }
  
    updateProduct(): void
    {
      const defaultImageEntry = this.selectedImages.find(i => i.file);
      const defaultImage = defaultImageEntry.file;
      this.product.category_id=this.product.category.id;
      this.product.sub_category_id=this.product.sub_category.id;
      
      this.product.product_status_id=this.product.product_status.id;
      this.product.is_add_on=true
      this.product = new ProductMaster(this.product);
      // debugger;
        // First, remove images if any
    if (this.removedImageIds.length > 0) {
      this.productService.removeProductImages(this.removedImageIds).subscribe(
        () => console.log('Removed old images'),
        err => console.error('Error removing images', err)
      );
    }
  
      //this.isLoading = true;
      //this.service.entityType = 'SERVICE';
      this.productService.updateProduct(this.product.toJSON(),defaultImage).subscribe(
        (data) => {
          //this.isLoading = false;
          this.sweetAlertService.successAlert(
            "Product Updated Successfully"
          );
          this.saveEvents.emit();
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
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
    }
  
    getCategoryList() {
      const category = new CategoryMaster();
      category.is_active = true;
    
      this.categoryService.getCategoryList(category).subscribe(
        (response: any) => {  // <- Change here: accept the full response object
          this.categoryList = response.data 
          // console.log("product...........",this.product)
          // debugger;
          // if(this.product?.id==undefined){
          //   this.product.category=null
          // }
          // console.log("product...........",this.product)
          // debugger;
    
          // Auto-select the matched category when editing
          if (this.product?.id && this.product.category?.id) {
            const matchedCategory = this.categoryList.find(cat => cat.id === this.product.category.id);
            if (matchedCategory) {
              this.product.category = matchedCategory;
            }
          }
        },
        (err: HttpErrorResponse) => {
          console.error('Failed to fetch categories:', err);
        }
      );
    }
    
  
    getProductStatusList() {
      const predefined = new PredefinedMaster();
      predefined.is_active = true;
      predefined.entity_type='PRODUCT-STATUS'
    
      this.predefinedService.getPredefinedList(predefined).subscribe(
        (response: any) => {  // <- Change here: accept the full response object
          this.productStatusList = response.data 
          // console.log("product...........",this.product)
          // debugger;
          // if(this.product?.id==undefined){
          //   this.product.category=null
          // }
          // console.log("product...........",this.product)
          // debugger;
    
          // Auto-select the matched category when editing
          if (this.product?.id && this.product.product_status?.id) {
            const matchedCategory = this.productStatusList.find(cat => cat.id === this.product.product_status.id);
            if (matchedCategory) {
              this.product.product_status = matchedCategory;
            }
          }
        },
        (err: HttpErrorResponse) => {
          console.error('Failed to fetch categories:', err);
        }
      );
    }
    
    
  
    getSubCategoryList(category) {
      // debugger;
      const sub_category = new SubCategoryMaster();
      sub_category.is_active = true;
      sub_category.category_id=category.id;
    
      this.categoryService.getSubcategoryList(sub_category).subscribe(
        (response: any) => {
          this.subCategoryList = response.data;
    
          // If editing an existing product, assign the matched category
          if (this.product?.sub_category?.id) {
            const matchedSubCategory = this.subCategoryList.find(
              sub => sub.id === this.product.sub_category.id
            );
            if (matchedSubCategory) {
              this.product.sub_category = matchedSubCategory; // set reference correctly
              this.addProductForm.get('sub_category')?.setValue(matchedSubCategory); // update form value
            }
          }
          
          
        },
        (err: HttpErrorResponse) => {
          console.error('Failed to fetch categories:', err);
        }
      );
    }

}
