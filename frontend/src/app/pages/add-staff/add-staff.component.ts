import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Factory } from 'src/app/model/Factory.model';
import { ModuleMaster } from 'src/app/model/ModuleMaster.model';
import { Role } from 'src/app/model/Role.model';
import { StaffMaster } from 'src/app/model/StaffMaster.model';
import { FactoryService } from 'src/app/service/factory.service';
import { StaffService } from 'src/app/service/staff.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent implements OnInit {
  addStaffForm:UntypedFormGroup;
  staff:StaffMaster = new StaffMaster();
  @Output() close = new EventEmitter<boolean>();
  @Input() hideButton: boolean;
  @Input() eventData: StaffMaster;
  isLoading: boolean = false;
  roleList:any[];
  errorBean: any = {};
  @Output() saveEvents: EventEmitter<any> = new EventEmitter();
  msg: string;
  factoryList:any[];
  rangeDates: Date[];
  moduleList:any[];
  @ViewChild('calendar') private calendar: any;
  minDate: Date;
  maxDate: Date;
  factory: Factory = new Factory();

  constructor(private factoryService: FactoryService, public staffService:StaffService, private sweetAlertService:SweetAlertService) { }

  ngOnInit(): void {

    this.addStaffForm = new UntypedFormGroup({
      firstname: new UntypedFormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      lastname: new UntypedFormControl("", [Validators.required, this.leadingSpaceValidator, Validators.maxLength(500)]),
      email: new UntypedFormControl("", [Validators.required,Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      )]),
      phone: new UntypedFormControl(""),
      alternatePhone :  new UntypedFormControl(""),
      dob: new UntypedFormControl(""),
      doj: new UntypedFormControl(""),
      factory: new UntypedFormControl("", [Validators.required]),
      roles: new UntypedFormControl("", [Validators.required]),
      adminLogin : new UntypedFormControl(false),
      accessControlMasterList : new UntypedFormControl("",[Validators.required]),
    });

    if(this.eventData)
    {
      this.staff = this.eventData;
      //console.log(this.staff, "staff for update");
    }

    this.getRoleList();
    this.getFactoryList();
    this.getModuleList();

    this.minDate = new Date(this.staff.dob);
    let date :Date;

      
    if(this.staff.dob==null || this.staff.dob==undefined){
      this.staff.dob=date;
    }else{
      this.staff.dob=new Date(this.staff.dob)
    }


      
    if(this.staff.doj==null || this.staff.doj==undefined){
      this.staff.doj=date;
    }else{
      this.staff.doj=new Date(this.staff.doj)
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

  keyPressForName(event:any) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z '.]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  errorShowphone() {
    if(this.staff.phone){
      if (this.staff.phone.toString().length != 10) {
        this.errorBean.phone1 = true;
        this.errorBean.phone = false;
      } else {
        this.errorBean.phone1 = false;
      }
    }
  }
  errorShowphone1() {
    if(this.staff.alternatePhone){
      if (this.staff.alternatePhone.toString().length != 10) {
        this.errorBean.phone2 = true;
        this.errorBean.alternatePhone = false;
      } else {
        this.errorBean.phone2 = false;
      }
    }
  }

  getRoleList()
  {
    let role = new Role();
    
    this.staffService.getRoleList(role).subscribe(
      (data) => {
      this.roleList = data.data;
      //console.log(this.roleList, "role List");
      //console.log(this.user,'user data');
      
      this.staff.selectedRoleValueList = [];
      this.staff.roles = []
      if(this.staff.selectedRole)
      {
        this.roleList.forEach(role => {    
          if(role.id == this.staff.selectedRole.id)
          {
            this.staff.selectedRole = role;
          }
        });
      }
      //console.log(this.user,'rolelist');
    },
    (err: HttpErrorResponse) => {
      if (err.status === 200) {
        let jsonString = err.error.text;
        jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
      }
    }
    );
  }

  saveStaff(): void
  {
    //console.log(this.staff.roles, "Role");
    this.staff.roles = [];
    this.staff.roles.push(this.staff.selectedRole.name);

    this.staff.factoryUserList = [];
    this.staff.factory.forEach(element => {
      let factoryUser:any={};
      factoryUser.factoryMaster = element
      factoryUser.factoryId = element.id
      this.staff.factoryUserList.push(factoryUser);
    });
    
    //console.log(this.staff, "staff");
    this.staffService.saveStaff(this.staff).subscribe(
      (data) => {
        //console.log(data,"data");
        this.sweetAlertService.successAlert(
          "User has been added successfully"
        );
        this.saveEvents.emit();
      },
      (err: HttpErrorResponse) => {
        
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        }else if(err.status === 400){
          //console.log(err.error.error.message,'msg');
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

  updateStaff(): void
  {
    //this.isLoading = true;
    //this.service.entityType = 'SERVICE';
    this.staff.roles = [];
    this.staff.roles.push(this.staff.selectedRole.name);

    this.staff.factoryUserList = [];
    this.staff.factory.forEach(element => {
      let factoryUser:any={};
      factoryUser.factoryMaster = element
      factoryUser.factoryId = element.id
      this.staff.factoryUserList.push(factoryUser);
      //this.staff.factoryUserList.push(factoryUser);
    });
    //this.factory = this.factoryService.getFactorySession();
    //this.staff.factoryId = this.factory.id;

    this.staffService.updateStaff(this.staff).subscribe(
      (data) => {
        //this.isLoading = false;
        this.sweetAlertService.successAlert(
          "User Updated Successfully"
        );
        this.saveEvents.emit();
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        }else if(err.status === 400){
          //console.log(err.error.error.message,'msg');
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

  getFactoryList()
  {
    let factory = new Factory();
    factory.isDeactivate = 'N';
    this.staffService.getFactoryList(factory).subscribe(
      (data) => {
      this.factoryList = data.data;     
      //console.log(this.factoryList,'factorylist'); 
      //this.staff.selectedFactoryValueList = [];
      this.staff.factory = []
      this.factoryList.forEach(fact => {       
        this.staff.factoryUserList.forEach(factElem => {
          //console.log(factElem,'fact list selected');
          if(factElem.factoryId == fact.id)
          {
            this.staff.factory.push(fact);
          }
        }); 
      });
      //console.log(this.staff,'factory user list');
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
    //console.log("asd")
      if (this.staff.rangeDates[1]) { // If second date is selected
        this.calendar.overlayVisible=false;
    }
  }

  staffMultiselect(selectedItems: any[], staff): void
  {
    console.log(selectedItems, 'staff selected');

    staff.factoryUserList = selectedItems;

    /*staff.factoryUserList.forEach(staff => {
      console.log(staff.id, 'staff selected');
        const isSelected = selectedItems.some(item => item.id === staff.id);
        
        if (!isSelected) {
            staff.isDelete = 'Y';
        }
    });*/

    // Iterate through the existing job documents
    this.staff.factoryUserList.forEach(factElem => {
      // Check if the document exists in the selected items
      const isSelected = selectedItems.some(item => item.id === factElem.id);
      
      // If the document is not selected, mark it for deletion
      if (!isSelected) {
        factElem.isDelete = 'Y';
      }
    });

    // Iterate through the selected items
    selectedItems.forEach(selectedItem => {
      // Check if the selected item already exists in jobDocument
      const existingStaff = this.staff.factoryUserList.find(fact => fact.id === selectedItem.id);

      // If the selected item doesn't exist, add it to jobDocument
      if (!existingStaff) {
          const newFreezer = new Factory();
          newFreezer.factoryMaster = selectedItem;
          newFreezer.isDelete = 'N';
          this.staff.factoryUserList.push(newFreezer);
          console.log(this.staff, 'checking attribute list selected or not');
      } else {
          // If the selected item already exists, mark it for not deletion
          existingStaff.isDelete = 'N';
      }
    });

    // Iterate through the selected items
   /* selectedItems.forEach(selectedItem => {
        // Check if the selected item already exists
        const existingStaff = this.staff.factoryUserList.find(doc => doc.id === selectedItem.id);

        if (!existingStaff) {
            const newFactory = new Factory();
            newFactory.factoryMaster = selectedItem;
            newFactory.isDelete = 'N';
            this.staff.factoryUserList.push(newFactory);
            console.log(this.staff, 'checking attribute list selected or not');
        } else {
            // If the selected item already exists, mark it for not deletion
            existingStaff.isDelete = 'N';
        }
    });*/
  }


  getModuleList()
  {
      let module = new ModuleMaster();
      module.type = "'ADMIN', 'BOTH'";
    
      this.staffService.getModuleList(module).subscribe(
        (data) => {
        this.moduleList = data.data;
        console.log(this.moduleList, "module List");
        this.staff.selectedAccessControlList = [];
        
        if(this.staff.accessControlMasterList){
          this.moduleList.forEach(staffmodule => {
              this.staff.accessControlMasterList.forEach(staffModuleElement => {
                
                if(staffModuleElement.moduleMaster.id !== null && staffModuleElement.moduleMaster.id !== undefined && 
                  staffModuleElement.moduleMaster.id === staffmodule.id){
                  
                  this.staff.selectedAccessControlList.push(staffmodule);
                  console.log(this.staff.selectedAccessControlList, "selectedAccessControlList");
                }
              });
            });
        }
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        }
      });
  }


  staffAccessControlMultiselect(selectedItems: any[], staff): void {
    console.log(selectedItems, 'document selected');

    staff.accessControlMasterList = selectedItems;

    // Iterate through the existing access control
    this.staff.accessControlMasterList.forEach(module => {
        // Check if the module exists in the selected items
        const isSelected = selectedItems.some(item => item.id === module.moduleMaster.id);
        
        // If the module is not selected, mark it for deletion
        if (!isSelected) {
            module.isDelete = 'Y';
        }
    });

    // Iterate through the selected items
    selectedItems.forEach(selectedItem => {
        // Check if the selected item already exists in jobDocument
        const existingDocument = this.staff.accessControlMasterList.find(mod => mod.moduleMaster.id === selectedItem.id);

        // If the selected item doesn't exist, add it to jobDocument
        if (!existingDocument) {
            const newDocument = new ModuleMaster();
            newDocument.moduleMaster = selectedItem;
            newDocument.isDelete = 'N';
            this.staff.accessControlMasterList.push(newDocument);
            console.log(this.staff, 'checking attribute list selected or not');
        } else {
            // If the selected item already exists, mark it for not deletion
            existingDocument.isDelete = 'N';
        }
    });
  }


}
