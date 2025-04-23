import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from 'src/app/model/Role.model';
import { User } from 'src/app/model/User.model';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addUserForm:FormGroup;
  userList:any[];
  clientList:any[];
  roleList:any[];
  user:User = new User();
  uploadImagePath: any;
  value1: any;
  msg: string;
  imageSrc:any;
  errorBean: any = {};
  getRemoteConfigResponse: any;
  @Input() hideButton: boolean;
  @Input() eventData: User;
  @Output() saveEvents: EventEmitter<any> = new EventEmitter();
  @Output() close = new EventEmitter<boolean>();
  value2:number;
  visible: boolean = true;
  changetype: boolean = true;
  value4: any;
  passwordTooltip: string;
  uploadedImage: any;
  value8: any;
  cities: any[];
  fileSizeExceeded: boolean = false;
  fileSizeErrorMessage: string = '';
  // operatorUser: User = new User();
  constructor(private userService: UserService, private sweetAlertService:SweetAlertService) {
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
   }


  ngOnInit(): void {
    if(this.eventData)
    {
      this.user = this.eventData;
      console.log(this.user, "user for update");
    }

    this.addUserForm = new FormGroup({
      firstName: new FormControl("", [Validators.required, this.leadingSpaceValidator]),
      lastName: new FormControl("", [Validators.required, this.leadingSpaceValidator]),
      phone: new FormControl("", Validators.required),
      address: new FormControl(""),
      email: new FormControl("", [Validators.required,Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      )]),
      password: new FormControl(""),
      // address: new FormControl(""),
    });

    // Check if 'password' form control exists before setting validators
    this.updatePasswordValidator();
    
    if(this.user && this.user.profileImageUrl && this.user.profileImageUrl != null)    //.eventImage1.length
    {
      console.log("user profile exist.");
      // console.log("First filePath:", this.project.projectDocumentList[0].filePath);
      this.imageSrc = this.user.profileImageUrl;
      
    }else{
      this.imageSrc = null;
    }


    this.passwordTooltip = 
    `Password must have at least 6 characters
    including one uppercase letter,
    one lowercase letter,
    one digit, and
    one special character.
    `;
    
    this.getRoleList();

  }

  private updatePasswordValidator(): void {
    const passwordControl = this.addUserForm.get('password');
    //console.log(this.user.id, 'pwd vlaidation');
   
    //this.user = this.eventData;
    if (!this.user.id) {
      console.log('add');
      passwordControl.setValidators([Validators.required,this.passwordValidator]);
    }
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
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

  keyPressAddress(event:any) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z0-9 -,_./&()]/.test(inp) && !['*', '!', '%','$'].includes(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  passwordValidator(control) {
    const password = control.value;
    const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,}$/;
    return regex.test(password) ? null : { invalidPassword: true };
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

  onUpload(event: any) {
    
  }

  errorShowphone() {
    if(this.user.phone){
      if (this.user.phone.toString().length != 10) {
        this.errorBean.phone1 = true;
        this.errorBean.phone = false;
      } else {
        this.errorBean.phone1 = false;
      }
    }
  }

  uploadDocument(userId,event: any): void{
    this.uploadImagePath=[];
    console.log(event.target.files,'img type')
    //if (event.target.files) {
    for(let file of event.target.files) {
      if (!['image/jpeg','image/png','image/jpg'].includes(file.type)) {
        this.msg = 'The file should be in JPEG, JPG or PNG format';
        this.sweetAlertService.errorAlert( 
          this.msg
        );
        this.saveEvents.emit();
      } else if (file.size > 1e+6) {
        this.fileSizeExceeded = true;
        this.fileSizeErrorMessage = 'File is too large. Over 1MB';
      } else {    
        if(userId!==null && userId!==undefined)
        {   
          const file = event.target.files[0];
          this.uploadImagePath.push(file);
          let fd = new FormData();
          fd.append("file",userId)
          for (let x = 0; x < this.uploadImagePath?.length; x++) {
            fd.append("files",this.uploadImagePath[x]);
          };
        }else{
          //console.log("uploadDocument else");
          //this.uploadImagePath.push(file);
          //this.uploadImagePath.push(file);
          //this.readURL(file);
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = reader.result;
          reader.readAsDataURL(file);
          this.uploadImagePath.push(file);
        }
      }
    }
  }

  deleteImgSrc(imageSrc:any){
    console.log(this.user, "deleteImgSrc");
    if(this.user.id == null || this.user.id == undefined){
      console.log("deleteImgSrc");
    // this.imageSrc = this.imageSrc.filter(img=>img!=imageSrc);
      this.imageSrc = null;
      console.log(this.imageSrc, "image");
    }
    
  }

  saveUser(): void
  {
    this.user.username = this.user.email;
    console.log(this.user.roles, "Role");
    this.user.selectedRoleValueList[0] = this.user.roles;
    this.user.roles = this.user.selectedRoleValueList.map(role => role.name);
    // delete this.user.selectedRoleValueList;
    if(this.uploadImagePath == 'undefined')
    {
      this.uploadImagePath = [];
    }
    console.log(this.uploadImagePath,'save img');
    // console.log(this.user,'save img');
    // this.user.roles = ["ROLE_USER"];
    this.userService.saveUser(this.user,this.uploadImagePath).subscribe(
      (data) => {
        //console.log(data,"data");
        this.sweetAlertService.successAlert(
          "User has been added successfully"
          // this.getRemoteConfigResponse?.SweetAlert_message?.Success_message
        );
        this.saveEvents.emit();
        //this.router.navigateByUrl("panel/event-master")
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

  getRoleList()
  {
    let role = new Role();
    
    this.userService.getRoleList(role).subscribe(
      (data) => {
      this.roleList = data.data;
      //console.log(this.roleList, "role List");
      //console.log(this.user,'user data');
      
      this.user.selectedRoleValueList = [];
      this.user.roles = []
      this.roleList.forEach(role => {       
        this.user.roles.forEach(roleElem => {
          //console.log(roleElem.id,'role elem');
          if(roleElem.id == role.id)
          {
            this.user.selectedRoleValueList.push(roleElem.name);
          }
        }); 
      });
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

  userRoleMulti(value)
  {
    this.user.roles = []
    // console.log(attribute,'attirbute');
    // console.log(value, "test");
    
    value.value.forEach(val =>{
      // this.job.jobDocumentMasterList.forEach(element => {
        // console.log(val, "testValue");
        const clonedVal = Object.assign({}, val);
        clonedVal.id = undefined;
        clonedVal.uuid = undefined;

      // });
      this.user.roles.push(clonedVal.name);
    })
    
    console.log(this.user,'checking role list selected or not')
  }
}
