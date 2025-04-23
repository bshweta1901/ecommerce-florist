import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Factory } from 'src/app/model/Factory.model';
import { FactoryService } from 'src/app/service/factory.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';

@Component({
  selector: 'app-add-factory',
  templateUrl: './add-factory.component.html',
  styleUrls: ['./add-factory.component.scss']
})
export class AddFactoryComponent implements OnInit {
  addFactoryForm: FormGroup;
  rackList:any[];
  trolleyList:any[];
  // freezer: Freezer = new Freezer();
  factory: Factory = new Factory();
  @Output() close = new EventEmitter<boolean>();
  @Input() hideButton: boolean;
  @Input() eventData: Factory;
  isLoading: boolean = false;
  errorBean: any = {};
  @Output() saveEvents: EventEmitter<any> = new EventEmitter();
  msg: string;
  
  constructor(public factoryService: FactoryService, private sweetAlertService:SweetAlertService,) { }

  ngOnInit(): void {

    this.addFactoryForm = new FormGroup({
      location: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      factoryName: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      code: new FormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)])
    });

    if(this.eventData)
    {
      this.factory = this.eventData;
      // console.log(this.freezer, "service for update");
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

  keyPressForAlphaNum(event:any) {
    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z 0-9'.]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  saveFactory(): void
  {  
    this.factoryService.saveFactory(this.factory).subscribe(
      (data) => {
        //console.log(data,"data");
        this.sweetAlertService.successAlert(
          "Factory has been added successfully"
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

  updateFactory(): void
  {
    //this.isLoading = true;
    //this.service.entityType = 'SERVICE';
    this.factoryService.updateFactory(this.factory).subscribe(
      (data) => {
        //this.isLoading = false;
        this.sweetAlertService.successAlert(
          "Factory Updated Successfully"
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



}
