import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AccessControlMaster } from 'src/app/model/AccessControlMaster.model';
import { ModuleMaster } from 'src/app/model/ModuleMaster.model';
import { Role } from 'src/app/model/Role.model';
import { User } from 'src/app/model/User.model';
import { AuthService } from 'src/app/service/auth.service';


@Component({
  selector: 'app-access-control-master',
  templateUrl: './access-control-master.component.html',
  styleUrls: ['./access-control-master.component.scss']
})
export class AccessControlMasterComponent implements OnInit {
  @ViewChild('accessControlModalClose') accessControlModalClose:ElementRef;
  accessControlMaster:AccessControlMaster=new AccessControlMaster();
  accessControlMasterFilter:AccessControlMaster=new AccessControlMaster();
  @Input() accessControlMasterList:AccessControlMaster[]=[];
  accessControlMasterSelectedList:AccessControlMaster[]=[];
  roleMaster:Role=new Role();
  roleList:Role[]=[];
  // moduleList: SelectItem[];
  selectedModuleList: ModuleMaster[] = [];
  moduleMaster:ModuleMaster=new ModuleMaster();
  accessControlMasterMap: { [moduleCode: string]: AccessControlMaster; } = { };
  pageSize:number=100;
  pageNumber:number=0;
  totalRecords:number=0;
  cols:any[]=[];
  // userLoginMaster: UserLogin = new UserLogin();
  selectedModules = [];
  employeeMaster: User = new User();

 @Input()  currentUser:User;

  constructor() { }

  ngOnInit() {}


//     //{filterfield:'userName',field:'userName',header:'User Name'},

//     if(this.employeeMaster===null || this.employeeMaster===undefined || this.employeeMaster.id===null
//       ||  this.employeeMaster.id===undefined ||  this.employeeMaster.id===0){
//         this.employeeMaster=JSON.parse(localStorage.getItem("employeeSession"));
//         //console.log('Employee id: ' + this.employeeMaster.employeeId);
//     }

//     this.accessControlMasterMap=this.authService.getAccessControlMapData();
//     this.cols=[
//       {filterfield:'roleName',field:'roleName',header:'Role Name'},
//       {filterfield:'moduleName',field:'moduleName',header:'Module Name'},
//       {filterfield:'createAccess',field:'createAccess', header:'Create Access'},
//       {filterfield:'readAccess',field:'readAccess', header:'Read Access'},
//       {filterfield:'updateAccess',field:'updateAccess', header:'Update Access'},
//       {filterfield:'deleteAccess',field:'deleteAccess', header:'Delete Access'}
//     ];

//     this.accessControlMasterFilter.pageNumber=this.pageNumber;
//     this.accessControlMasterFilter.pageSize=this.pageSize;
//     //this.getAcessControlAllList();
//     this.getModuleLookupList();
//   }

//   reInitialize(){
//     this.selectedModules=[];
//     this.moduleMaster=new ModuleMaster();
//     this.roleMaster=new Role();
//     this.accessControlMaster=new AccessControlMaster();
//     this.accessControlMasterList=[];
//     this.roleMaster.id=0;
//   }

//   addAccessControlModal(){
//     this.accessControlMaster=new AccessControlMaster();
//     this.accessControlMaster.isDelete="N";

//   }

//   updateAccessControlModel(accessControlMaster:AccessControlMaster){
//     console.log(accessControlMaster);



//     this.accessControlMaster=accessControlMaster;
//     this.moduleMaster=accessControlMaster.moduleMaster;
//     let moduleMaster : ModuleMaster;

//     moduleMaster =  accessControlMaster.moduleMaster;
//     this.selectedModuleList.push(moduleMaster);
//   }

//   saveAccessControl(){

//     this.accessControlMaster.user = new UserLogin();
//     this.accessControlMaster.user.id = this.currentUser.employeeId;

//     for(let moduleItem of this.selectedModuleList){

//       this.accessControlMaster.moduleMaster = moduleItem;
//     //  this.accessControlMaster.employeeId = this.employeeMaster.employeeId;
//       this.accessControlMaster.employeeId = this.currentUser.employeeId;
//       console.log(this.accessControlMaster);
//        this.moduleMasterService.saveAccessControl(this.accessControlMaster).subscribe( data => {

//       if(this.accessControlMaster.accessControlId===null || this.accessControlMaster.accessControlId===undefined || this.accessControlMaster.accessControlId===0){
//         //this.getAcessControlAllList();
//         this.getAcessControlListByEmployee();


//         this.accessControlModalClose.nativeElement.click();
//         this.authService.showMessage('success','AccessControl Saved Successfully','');
//       }else{
//           //this.getAcessControlAllList();
//         this.getAcessControlListByEmployee();

//         this.accessControlModalClose.nativeElement.click();
//         this.authService.showMessage('success','AccessControl Updated Successfully','');
//       }


//     },error =>{
//       if (error instanceof HttpErrorResponse) {

//         if (error.status === 200) {
//            // console.log(error.error.text);
//            //json circular break at server side always add
//            //extra information of timestamp and status along with
//            //main json so parsing occurs still at status 200
//            let jsonString=error.error.text;
//            jsonString=jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
//            this.accessControlMasterList=JSON.parse(jsonString);
//         }else{
//          // this.authService.showMessage('error','Something Went Wrong','');
//       }

//       }
//     });
//     }
//   }

//   deleteAccessControl(accessControlMaster:AccessControlMaster):void{
//     console.log("delete employee");
//     this.confirmationService.confirm({
//       message: 'Are you sure that you want to delete?',
//       header: 'Confirmation',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         accessControlMaster.isDelete='Y';
//         this.accessControlMaster =accessControlMaster;
//         let moduleMaster : ModuleMaster;

//         moduleMaster =  accessControlMaster.moduleMaster;
//         this.selectedModuleList.push(moduleMaster);
//         this.saveAccessControl();
//         // this.moduleMasterService.saveAccessControl(accessControlMaster).subscribe( data => {

//         //     this.authService.showMessage('success','Deleted Successfully','');
//         //     this.getAcessControlAllList();
//         // },error =>{
//         //   if (error instanceof HttpErrorResponse) {

//         //     if (error.status === 500) {

//         //       this.authService.showMessage('error','AccessControl cannot be deleted','');
//         //     }else{
//         //       this.authService.showMessage('error','Something Went Wrong','');
//         //   }
//         //   }
//         // });
//       },
//       reject: () => {

//       }
//   });
//   }


// getAcessControlAllList(){
//   this.getAcessControlAllListLength();
//   this.moduleMasterService.getAcessControlAllList(this.accessControlMasterFilter).subscribe( data => {
//    this.accessControlMasterList=data;
//    this.accessControlMaster= this.accessControlMasterList[0];

//    console.log(this.accessControlMaster);
//   },error =>{
//     if (error instanceof HttpErrorResponse) {

//       if (error.status === 200) {
//          // console.log(error.error.text);
//          //json circular break at server side always add
//          //extra information of timestamp and status along with
//          //main json so parsing occurs still at status 200
//          let jsonString=error.error.text;
//          jsonString=jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
//          this.accessControlMasterList=JSON.parse(jsonString);
//       }else{
//        // this.authService.showMessage('error','Something Went Wrong','');
//     }

//     }
//   });
// }


// getAcessControlAllListLength(){
//   this.moduleMasterService.getAcessControlAllListLength(this.accessControlMasterFilter).subscribe( data => {
//    this.totalRecords=data;
//   },error =>{
//     if (error instanceof HttpErrorResponse) {

//       if (error.status === 200) {
//          // console.log(error.error.text);
//          //json circular break at server side always add
//          //extra information of timestamp and status along with
//          //main json so parsing occurs still at status 200
//          let jsonString=error.error.text;
//          jsonString=jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
//          this.totalRecords=JSON.parse(jsonString);
//       }else{
//        // this.authService.showMessage('error','Something Went Wrong','');
//     }

//     }
//   });
// }

// getModuleLookupList(){
//   this.moduleMasterService.getModuleLookupList(new ModuleMaster()).subscribe( data => {
//    this.moduleList = data;

//   },error =>{
//     if (error instanceof HttpErrorResponse) {

//       if (error.status === 200) {
//          // console.log(error.error.text);
//          //json circular break at server side always add
//          //extra information of timestamp and status along with
//          //main json so parsing occurs still at status 200
//          let jsonString=error.error.text;
//          jsonString=jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
//          this.moduleList=JSON.parse(jsonString);
//       }else{
//        // this.authService.showMessage('error','Something Went Wrong','');
//     }

//     }
//   });
// }

// onItemSelect (item:any) {
//   console.log(item);
// }
// onSelectAll (items: any) {
//   console.log(items);
// }
// onItemDeSelect(item:any){
//   console.log(item);
//   for(let item of this.selectedModules){
//     console.log(item.item_text);
//   }

// }

// paginate(event) {

//   this.accessControlMaster.pageNumber=event.page;
//   this.accessControlMaster.pageSize=this.pageSize;
//   this.getAcessControlAllList();

// }

// getAcessControlListByEmployee(){

//   this.moduleMasterService.getAcessControlListByEmployee(this.currentUser).subscribe( data => {
//    this.accessControlMasterList=data;

//   },error =>{
//     if (error instanceof HttpErrorResponse) {

//       if (error.status === 200) {
//          // console.log(error.error.text);
//          //json circular break at server side always add
//          //extra information of timestamp and status along with
//          //main json so parsing occurs still at status 200
//          let jsonString=error.error.text;
//          jsonString=jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
//          this.accessControlMasterList=JSON.parse(jsonString);
//       }else{
//        // this.authService.showMessage('error','Something Went Wrong','');
//     }

//     }
//   });

//   this.selectedModuleList=[];
// }

}
