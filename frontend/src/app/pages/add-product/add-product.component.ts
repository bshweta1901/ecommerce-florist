import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CategoryMaster } from 'src/app/model/CategoryMaster.model';
import { Factory } from 'src/app/model/Factory.model';
import { GiveAwayMaster } from 'src/app/model/GiveAwayMaster.model';
import { PredefinedMaster } from 'src/app/model/PredefinedMaster.model';
import { ProductMaster } from 'src/app/model/ProductMaster.model';
import { Role } from 'src/app/model/Role.model';
import { StaffMaster } from 'src/app/model/StaffMaster.model';
import { SubCategoryMaster } from 'src/app/model/SubCategoryMaster.model';
import { CategoryService } from 'src/app/service/category.service';
import { PredefinedService } from 'src/app/service/predefined.service';
import { ProductService } from 'src/app/service/product.service';
import { StaffService } from 'src/app/service/staff.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';




export function offerPriceValidator(form: AbstractControl): ValidationErrors | null {
  const price = form.get('price')?.value;
  const offerPrice = form.get('offer_price')?.value;

  if (price != null && offerPrice != null && offerPrice > price) {
    return { invalidOfferPrice: true };
  }

  return null;
}
export function isDefaultValidator(form: AbstractControl): ValidationErrors | null {
  const is_default = form.get('is_default')?.value;
  
  if (is_default==undefined || is_default == null ) {
    return { isDefaultImage: true };
  }

  return null;
}



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
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
  selectedDefaultImageId: number | null = null;
  imageSelected: boolean = false;


  selectedImages: { file: File, preview: string, isDefault: boolean }[] = [];
  images: { file: File, preview: string, isDefault: boolean }[] = [];

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
      is_default: new FormControl([Validators.required]),
      // defaultImage: new FormControl('', [this.defaultImageValidator.bind(this)]),
      // defaultImage: new FormControl(null, Validators.required),
    }, offerPriceValidator);  // 👈 apply the group-level validator here
    console.log("product..",this.product)
  
    if (this.eventData) {
      this.product = this.eventData;
      const selectedDefaultImageId = this.product.product_images?.find(img => img.is_default)?.id || null;
      this.selectedDefaultImageId = selectedDefaultImageId;


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

  validateDefaultImage(): void {
    const hasDefaultInExisting = this.product.product_images?.some(img => img.is_default);
    const hasDefaultInNew = this.selectedImages?.some(img => img.isDefault);
  
    if (!hasDefaultInExisting && !hasDefaultInNew) {
      this.addProductForm.get('defaultImage')?.setErrors({ noDefaultImage: true });
    } else {
      this.addProductForm.get('defaultImage')?.setErrors(null);
    }
  
    // Force form to update validity
    this.addProductForm.get('defaultImage')?.updateValueAndValidity();
  }
  

  defaultImageValidator(control: AbstractControl): ValidationErrors | null {
    const hasDefaultInExisting = this.product?.product_images?.some(img => img.is_default);
    const hasDefaultInSelected = this.selectedImages?.some(img => img.isDefault);
    return (hasDefaultInExisting || hasDefaultInSelected) ? null : { noDefaultImage: true };
  }
  
    
  
  
  onImageSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.imageSelected = true;
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = {
            file: file,
            preview: e.target.result, // ✅ Changed from 'url' to 'preview'
            isDefault: false
          };
          this.selectedImages.push(image);
  
          // Set first image as default if none is set
          if (!this.selectedImages.some(img => img.isDefault)) {
            this.selectedImages[0].isDefault = true;
          }
  
          // ✅ Set productImages control as valid
          this.addProductForm.get('productImages')?.setValue(this.selectedImages);
          this.addProductForm.get('productImages')?.updateValueAndValidity();
        };
        reader.readAsDataURL(file);
      }
    } else {
      this.imageSelected = false;
      this.selectedImages = [];
      this.addProductForm.get('productImages')?.setValue(null);
      this.addProductForm.get('productImages')?.updateValueAndValidity();
    }
    
  this.validateDefaultImage();
  }
  
  markExistingDefault(index: number): void {
    this.product.product_images.forEach((img, i) => img.is_default = i === index);
    this.validateDefaultImage();
  }
  
  markNewDefault(index: number): void {
    debugger;
    this.selectedImages.forEach((img, i) => img.isDefault = i === index);
    this.validateDefaultImage();
  }
  
  removeExistingImage(index: number): void {
    this.product.product_images.splice(index, 1);
    this.validateDefaultImage();
  }
  
  removeSelectedImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.validateDefaultImage();
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


  saveProduct(): void {
    debugger;
      // Check if form is invalid
    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }

    // Custom image validation
    const defaultImageEntry = this.selectedImages.find(i => i.isDefault);
    if (!defaultImageEntry) {
      this.addProductForm.get('defaultImage')?.setErrors({ noDefaultImage: true });
      return;
    } else {
      this.addProductForm.get('defaultImage')?.setErrors(null);
    }
  
    this.product.category_id = this.product.category.id;
    this.product.sub_category_id = this.product.sub_category.id;
    this.product.product_status_id = this.product.product_status.id;
  
    const defaultImage = defaultImageEntry.file;
    const otherImages = this.selectedImages.filter(i => !i.isDefault).map(i => i.file);
  
    this.productService.saveProduct(this.product, otherImages, defaultImage).subscribe(
      (data) => {
        this.sweetAlertService.successAlert("Product has been added successfully");
        this.saveEvents.emit();
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        } else if (err.status === 400) {
          this.msg = err.error.error.message;
          this.sweetAlertService.errorAlert(this.msg);
          this.saveEvents.emit();
        }
      }
    );
  }
  
  

  updateProduct(): void {
    // Validation: Make sure one new image is selected as default (if any images are uploaded)
    let defaultImageFile: File | null = null;
if (this.selectedImages.length > 0) {
  const defaultImageEntry = this.selectedImages.find(i => i.isDefault);
  if (!defaultImageEntry) {
    this.sweetAlertService.errorAlert('Please select a default image.');
    return;
  }
  defaultImageFile = defaultImageEntry.file;
}

// If an existing image is marked as default, call API to update it
if (this.selectedDefaultImageId) {
  console.log("defaylt image")
  // this.productService.setDefaultProductImage(this.product.id, this.selectedDefaultImageId).subscribe(
  //   () => console.log('Default image updated'),
  //   err => console.error('Failed to set default image', err)
  // );
}
  
    this.product.category_id = this.product.category.id;
    this.product.sub_category_id = this.product.sub_category.id;
    this.product.product_status_id = this.product.product_status.id;
    this.product = new ProductMaster(this.product);
  
    if (this.removedImageIds.length > 0) {
      this.productService.removeProductImages(this.removedImageIds).subscribe(
        () => console.log('Removed old images'),
        err => console.error('Error removing images', err)
      );
    }
  
    this.productService.updateProduct(this.product.toJSON(), this.selectedImages.map(i => i.file)).subscribe(
      (data) => {
        this.sweetAlertService.successAlert("Product Updated Successfully");
        this.saveEvents.emit();
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        } else if (err.status === 400) {
          this.msg = err.error.error.message;
          this.sweetAlertService.errorAlert(this.msg);
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
