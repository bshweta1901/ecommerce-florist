import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
  images: { file: File, previewUrl: string, isDefault: boolean }[] = [];

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
  imagesList: { id?:number; file: File, previewUrl: string, isDefault: boolean ,isNew: boolean; }[] = [];


  selectedImages: { file: File, preview: string, isDefault: boolean }[] = [];
  // images: { file: File, preview: string, isDefault: boolean }[] = [];

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
      images: new FormControl([], Validators.required)
    }, offerPriceValidator);  // 👈 apply the group-level validator here
    console.log("product..",this.product)
    
  
    if (this.eventData) {
      this.product = this.eventData;
       this.patchForm(this.product);
   
      this.addProductForm.patchValue({
  name: this.product.name,
  description: this.product.description,
  short_description: this.product.short_description,
  sku: this.product.sku,
  product_status: this.product.product_status?.id,
  category: this.product.category?.id,
  price: this.product.price,
  offer_price: this.product.offer_price,
  sub_category: this.product.sub_category?.id
});

    }
    if (this.product.category) {
      this.getSubCategoryList(this.product.category);  // This will set subcategory correctly inside
    }
    
    console.log("eventData..",this.product)


    
    this.getCategoryList();
    this.getProductStatusList();
  }

 onImageUpload(event: any) {
  const files = event.target.files;

  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagesList.push({
        file: file,
        previewUrl: e.target.result,
        isDefault: this.imagesList.length === 0,  // Make first image default by default
        isNew: true                                // Mark as new image
      });

      this.updateImageControl(); // Validate and sync with form
    };
    reader.readAsDataURL(file);
  }

  // Reset the input so user can upload the same file again if needed
  event.target.value = '';
}

      patchForm(productData: any) {
  this.addProductForm.patchValue({
    name: productData.name,
    description: productData.description,
    // ... other fields
  });

  // Populate existing images
  if (productData.product_images) {
    this.imagesList = productData.product_images.map((img: any, index: number) => ({
      id: img.id,
      previewUrl: img.file_path,
      isDefault: index === 0, // or based on actual "isDefault" if provided
      isNew: false
    }));

    this.updateImageControl(); // ✅ validate the image control
  }
}
removeImage(index: number) {
  const imageToRemove = this.imagesList[index];

  // If the image has an `id`, push it to removedImageIds
  if ('id' in imageToRemove && imageToRemove.id) {
    this.removedImageIds.push(imageToRemove.id);
  }

  this.imagesList.splice(index, 1);
  this.updateImageControl();
}


  updateImageControl() {
  // You can store image names or just track if valid
  const hasDefault = this.imagesList.some(img => img.isDefault);
// debugger;
  if (this.imagesList.length && hasDefault) {
    this.addProductForm.get('images')?.setValue(this.imagesList);
    this.addProductForm.get('images')?.setErrors(null);
  } else {
    this.addProductForm.get('images')?.setErrors({ required: true });
  }
}





setAsDefault(index: number) {
  this.imagesList.forEach((img, i) => img.isDefault = i === index);
  this.updateImageControl();
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
    // debugger;
      // Check if form is invalid
    if (this.addProductForm.invalid) {
      this.addProductForm.markAllAsTouched();
      return;
    }

    // Custom image validation
    const defaultImageEntry = this.imagesList.find(i => i.isDefault);

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
    const otherImages = this.imagesList.filter(i => !i.isDefault).map(i => i.file);
  
    this.productService.saveProduct(this.product,defaultImage, otherImages).subscribe(
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
  // debugger;
   
  // Validate that if images are present, one must be marked as default
  const defaultImageEntry = this.imagesList.find(i => i.isDefault);
  const defaultImageFile: File | null = defaultImageEntry?.file || null;
  // 3. If the default image has an `id` (i.e., it's an existing image), fetch the ID
  const selectedDefaultImageId: number | null = defaultImageEntry.hasOwnProperty('id') ? defaultImageEntry.id : null;

this.product.default_image_id=selectedDefaultImageId
  let otherImages = this.imagesList
  .filter(i => !i.isDefault && !('id' in i))
  .map(i => i.file);
  


  // Set product IDs from nested objects
  this.product.category_id = this.product.category?.id;
  this.product.sub_category_id = this.product.sub_category?.id;
  this.product.product_status_id = this.product.product_status?.id;

  // Convert to ProductMaster object
  this.product = new ProductMaster(this.product);

  // Remove any deleted images if applicable
  if (this.removedImageIds.length > 0) {
    this.productService.removeProductImages(this.removedImageIds).subscribe(
      () => console.log('Removed old images'),
      err => console.error('Error removing images', err)
    );
  }

  // Call update product API
  this.productService.updateProduct(this.product.toJSON(), defaultImageFile,otherImages).subscribe(
    (data) => {
      this.sweetAlertService.successAlert("Product Updated Successfully");
      this.saveEvents.emit();
    },
    (err: HttpErrorResponse) => {
      this.isLoading = false;
      if (err.status === 200) {
        const jsonString = err.error.text;
        console.warn('200 OK with error: ', jsonString);
      } else if (err.status === 400) {
        this.msg = err.error?.error?.message || "Bad Request";
        this.sweetAlertService.errorAlert(this.msg);
        this.saveEvents.emit();
      } else {
        this.sweetAlertService.errorAlert("Something went wrong. Please try again.");
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
