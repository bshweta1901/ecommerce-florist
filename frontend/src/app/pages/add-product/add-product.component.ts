import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Factory } from 'src/app/model/Factory.model';
import { GiveAwayMaster } from 'src/app/model/GiveAwayMaster.model';
import { PredefinedMaster } from 'src/app/model/PredefinedMaster.model';
import { ProductMaster } from 'src/app/model/ProductMaster.model';
import { Role } from 'src/app/model/Role.model';
import { StaffMaster } from 'src/app/model/StaffMaster.model';
import { PredefinedService } from 'src/app/service/predefined.service';
import { ProductService } from 'src/app/service/product.service';
import { StaffService } from 'src/app/service/staff.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  addProductForm:FormGroup;
  brandList:any[];
  stdList:any[];
  freezerList:any[];
  commodityList:any[];
  fatList:any[];
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
  constructor(public staffService:StaffService, private predefinedService:PredefinedService, private productService:ProductService, private sweetAlertService:SweetAlertService) { }

  ngOnInit(): void {

    this.addProductForm = new FormGroup({
      productName: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      productSKU: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      // lotNo: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      description: new FormControl("", [this.leadingSpaceValidator, Validators.maxLength(500)]),
      fatPercent: new FormControl("", [Validators.required]),
      brand: new FormControl(""),
      weight: new FormControl("", [Validators.required]),
      productCode: new FormControl("", [Validators.required]),
      weightkg: new FormControl("",[Validators.required]),
      // commodity: new FormControl("", [Validators.required]),
      // itemType: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),

      freezerTypes: new FormControl("", [Validators.required]),
    });

    if(this.eventData)
    {
      this.product = this.eventData;
      console.log(this.product, "service for update");
    }
    console.log(this.product.productSKU,"product.productSKU");

    this.getBrandList();
    this.getCommodityList();
    this.getFreezerTypeList();
    this.getItemTypeList();
    this.getCountryList();
    this.getStdWtList();

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
    //console.log(this.staff.roles, "Role");
    //this.staff.selectedRoleValueList[0] = this.staff.roles;
    //this.staff.roles = this.staff.selectedRoleValueList.map(role => role.name);
    
    this.productService.saveProduct(this.product).subscribe(
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
    //this.isLoading = true;
    //this.service.entityType = 'SERVICE';
    this.productService.updateProduct(this.product).subscribe(
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

  getBrandList()
  {
    let brand = new PredefinedMaster();
    brand.entityType = 'BRAND';
    brand.alphabeticOrder = true;
    //console.log(this.chiller,'full capacity list');
    this.predefinedService.getPredefinedList(brand).subscribe(
      (data) => {
      this.brandList = data.data;     

      if(this.product.uuid)
      {
        this.brandList.forEach(fact => {              
          if(fact.id == this.product.brand?.id)
          {
            this.product.brand = fact;
          }
        });
      }
      
    },
    (err: HttpErrorResponse) => {
      if (err.status === 200) {
        let jsonString = err.error.text;
        jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
      }
    }
    );
  }

  getCountryList()
  {
    let brand = new PredefinedMaster();
    brand.entityType = 'COUNTRY';
    brand.alphabeticOrder = true;
    //console.log(this.chiller,'full capacity list');
    this.predefinedService.getPredefinedList(brand).subscribe(
      (data) => {
      this.countryList = data.data;     

      if(this.product.uuid)
      {
        this.countryList.forEach(fact => {              
          if(fact.id == this.product.country?.id)
          {
            this.product.country = fact;
          }
        });
      }
      
    },
    (err: HttpErrorResponse) => {
      if (err.status === 200) {
        let jsonString = err.error.text;
        jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
      }
    }
    );
  }

  getCommodityList()
  {
    let commodity = new PredefinedMaster();
    commodity.entityType = 'COMMODITY';
    commodity.alphabeticOrder = true;
    //console.log(this.chiller,'full capacity list');
    this.predefinedService.getPredefinedList(commodity).subscribe(
      (data) => {
      this.commodityList = data.data;     

      if(this.product.uuid)
      {
        this.commodityList.forEach(fact => {              
          if(fact.id == this.product.commodity?.id)
          {
            this.product.commodity = fact;
          }
        });
      }
      
    },
    (err: HttpErrorResponse) => {
      if (err.status === 200) {
        let jsonString = err.error.text;
        jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
      }
    }
    );
  }

  getFreezerTypeList()
  {
    let freezerTypes = new PredefinedMaster();
    freezerTypes.entityType = 'FREEZER-TYPE';
    freezerTypes.alphabeticOrder = true;
    //console.log(this.chiller,'full capacity list');
    this.predefinedService.getPredefinedList(freezerTypes).subscribe(
      (data) => {
      this.freezerList = data.data;     

      if(this.product.uuid)
      {
        this.freezerList.forEach(fact => {              
          if(fact.id == this.product.freezerTypes?.id)
          {
            this.product.freezerTypes = fact;
          }
        });
      }
      
    },
    (err: HttpErrorResponse) => {
      if (err.status === 200) {
        let jsonString = err.error.text;
        jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
      }
    }
    );
  }
  getWeight(weightTemp:any){
    console.log(weightTemp.value,"weightTemp");
    this.weightstd = weightTemp.value;
    // this.getGiveAwayList();

    
  }
  onInputChange(value: any): void {
    const numStr = value.toString();
    this.lastThreeDigits = numStr.slice(-3);
    this.product.productCode = this.lastThreeDigits;
  }
  getItemTypeList()
  {
    let itemType = new PredefinedMaster();
    itemType.entityType = 'ITEM-TYPE';
    itemType.alphabeticOrder = true;
    //console.log(this.chiller,'full capacity list');
    this.predefinedService.getPredefinedList(itemType).subscribe(
      (data) => {
      this.itemList = data.data;     

      if(this.product.uuid)
      {
        this.itemList.forEach(fact => {              
          if(fact.id == this.product.itemType?.id)
          {
            this.product.itemType = fact;
          }
        });
      }
      
    },
    (err: HttpErrorResponse) => {
      if (err.status === 200) {
        let jsonString = err.error.text;
        jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
      }
    }
    );
  }

  getStdWtList()
  {
    let weight = new PredefinedMaster();
    weight.entityType = 'MASTER';
    weight.alphabeticOrder = true;
    //console.log(this.chiller,'full capacity list');
    this.predefinedService.getPredefinedList(weight).subscribe(
      (data) => {
      this.stdList = data.data;     

      if(this.product.uuid)
      {
        this.stdList.forEach(fact => {              
          if(fact.id == this.product.weight.id)
          {
            this.product.weight = fact;
          }
        });
      }
      
    },
    (err: HttpErrorResponse) => {
      if (err.status === 200) {
        let jsonString = err.error.text;
        jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
      }
    }
    );
  }


  onSelect(){
    
  }
}
