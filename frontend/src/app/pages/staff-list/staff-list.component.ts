import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StaffMaster } from 'src/app/model/StaffMaster.model';
import { AuthService } from 'src/app/service/auth.service';
import { StaffService } from 'src/app/service/staff.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';
import { AccessControlMaster } from 'src/app/model/AccessControlMaster.model';
import { Router } from '@angular/router';
import { PredefinedMaster } from 'src/app/model/PredefinedMaster.model';
import { PredefinedService } from 'src/app/service/predefined.service';
import { Factory } from 'src/app/model/Factory.model';
import { FactoryService } from 'src/app/service/factory.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {
  tableColsEvent: any[] = [];
  tableSettingsEvent: any = {};
  eventList: any[] = [];
  titleEVent: any;
  openAddDialogModuleEvent: boolean = false;
  staff:StaffMaster = new StaffMaster();
  hideButtonView: boolean = false;
  pageSize: number = 10;
  searchPlaceholder: string = "";
  pageNumber: number = 0;
  totalRecords: number;
  accessControlMasterMap: { [moduleCode: string]: AccessControlMaster; } = {};
  statusList:any[]=[];
  visibleSidebar:boolean=false;
  constructor(private predefinedService:PredefinedService, private factoryService: FactoryService,private router: Router, private auth:AuthService, private staffService:StaffService, private sweetAlertService:SweetAlertService ) { }

  ngOnInit(): void {
    // this.accessControlMasterMap = this.auth.getAccessControlMapData();
    // if(this.accessControlMasterMap['all'] == null || this.accessControlMasterMap['all'] == undefined)
    // {
    //   if(this.accessControlMasterMap['staff'] == null || this.accessControlMasterMap['staff'] == undefined)
    //   {
    //     localStorage.clear();
    //     this.router.navigateByUrl("/");
    //   }
    // }
    
    this.setTableSetting();
    this.getStaffList();
    // this.getStatusList();
  }

  setTableSetting() {
    
    this.searchPlaceholder = "Search";
    this.tableSettingsEvent = {
      // tableFilter: false,
      add: true,
      action: true,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: true,
      edit: true,
      view: false,
      active: true,
      deactive: true,
       allowExport: true,
 allowExportxl:false,
    };
    this.tableColsEvent = [
      // { field: 'id', header: 'ID', fieldType: "text" },
      { field: 'full_name', header: 'Name', fieldType: "adminTrue" },
      { field: 'email', header: 'Email ID', fieldType: "text"},
      { field: 'phone', header: 'Contact No', fieldType: "text"},
      { field: 'roles_name', header: 'Role', fieldType: "text"},  
      { field: 'status', header: 'Status', fieldType: 'text' },

    ];
  }

  getStaffList() {
    //const sessiondata = this.auth.getUserSession();
    //console.log(this.staff, 'session data');

    this.staff.page = this.staff?.page ? this.staff?.page : this.pageNumber;
    this.staff.per_page = this.staff?.per_page ? this.staff?.per_page : this.pageSize;
    
    this.staffService.getStaffList(this.staff).subscribe(
      (data) => {
        
        this.eventList = data.data;        
        this.totalRecords = data.total
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }
  resetFilter() {
    this.staff = new StaffMaster();
  this.getStaffList();
  this.visibleSidebar = false;

  }  
  searchFilter() {
    this.getStaffList();
    this.visibleSidebar = false;
  }

  paginateEvent(event) {
    this.pageSize = event.rows;
    this.staff.page = event.page;
    this.staff.per_page = this.pageSize;

    this.auth.setFilterSessionData("Filter",this.staff);
    this.getStaffList();
  }

  addEvent(){
    this.titleEVent="Add Staff";
    this.openAddDialogModuleEvent=true;
    this.staff = new StaffMaster();
    this.hideButtonView=true;
  }

  EditEvent($event){
    this.titleEVent="Update Staff"
    this.staff = $event;
    this.staffService.setStaffSession(this.staff);
    this.getStaffById(this.staff);
    //console.log(this.service, "update service");
  }

  getStaffById(staff:StaffMaster){
    this.staff=staff;    
    //console.log(this.service, "service id data");
    this.staffService.getStaffById(this.staff).subscribe(
      (data) => {  
          //console.log(data.data, 'service data');
          this.staff=data.data;
          if(this.staff.roles != null && this.staff.roles != undefined)
          {
            this.staff.selectedRole = this.staff.roles[0];
          }
          // this.project.startDate = new Date(this.project.startDate);
          this.staffService.setStaffSession(this.staff);
          this.openAddDialogModuleEvent=true;
          this.hideButtonView=false;
          // console.log(this.project, 'project data on list');
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        }
      }
    );
  }

  searchData($event){
    this.staff.searchValue= $event;
    this.getStaffList();
  }

  deleteEvent(event){
    //console.log(event);
    if(event.isDeactivate == 'N')
    {
      var title = "Please deactivate the staff member before deleting?";
      Swal.fire({
        title: title,
        //text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, deactive it!",
      }).then((result) => {
        if (result.dismiss != null && result.dismiss != undefined) {
            Swal.close();
        } else {
            this.deactiveStaffConfirmation(event);
          }
      });
    }else{
      var title = "Are you sure, you want to delete, there is no undo?";
    
      Swal.fire({
        title: title,
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.dismiss != null && result.dismiss != undefined) {
            Swal.close();
        } else {
                  var staffId = event.id;
                  this.staffService.deleteStaffById(staffId).subscribe(
                    (data) => {
                      Swal.fire(
                          "Deleted!",
                          "Staff deleted successfully.",
                          "success"
                      );
                      this.getStaffList();
                    },
                    (error) => {
                        if (error instanceof HttpErrorResponse) {
                            if (error.status === 200) {
                                Swal.fire(
                                    "Deleted!",
                                    "Staff deleted successfully.",
                                    "success"
                                );
                                this.getStaffList();
                            } else {
                            }
                        }
                    }
                  );
                }
      });
    }
  }
  
  closeEventDialog(){
    this.openAddDialogModuleEvent=false;
  }

  saveEventDialog(){
    this.openAddDialogModuleEvent=false;
    this.getStaffList();
  }

  getExportName(): string {
    return 'Staff List'; // Set the export filename based on the component name.
  }
  getStatusText(isActive: boolean): string {
    return isActive ? 'Active' : 'Deactive';
  }
  exportEntity() {
    let newarray = []
 
    if(this.eventList.length==0){
      this.sweetAlertService.infoAlert(
        "No data available"
      );
    }else{
      // console.log(this.genericListInput);
      this.eventList.forEach((arr) => {
        let obj = {}
        this.tableColsEvent.forEach((element) => {
          if (element.header == 'ID') {
            obj[`${element.header}`] = arr?.id
          }else if(element.header == 'Name'){
            obj[`${element.header}`] = arr?.name
          }else if(element.header == 'Contact No'){
            obj[`${element.header}`] = arr?.phone
          }else if(element.header == 'Email ID'){
            obj[`${element.header}`] = arr?.email
          }else if(element.header == 'Factory'){
            obj[`${element.header}`] = arr?.factoryName
          }else if(element.header == 'Role'){
            obj[`${element.header}`] = arr?.roleName
          } else if (element.header === 'Status') {
            if (arr?.isDeactivate === 'N') {
              obj[`${element.header}`] = 'Active';
            } else if (arr?.isDeactivate === 'Y') {
              obj[`${element.header}`] = 'Deactive';
            }
          }
        })
        newarray.push(obj)
 
      })
      // console.log(newarray)
 
      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(newarray);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "data");
      });
      //console.log(newarray);
     
    }
  }
 
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, "Staff List");
  }

  activeEntity($event){
    this.activeStaffById($event);
  }

  activeStaffById(staff:StaffMaster){
    Swal.fire({
      title: "Kindly confirm to Set Status active?",
      //text: "You able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, activate it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.staff=staff;
        this.staffService.activeStaff(this.staff).subscribe(
          (data) => {  
            this.sweetAlertService.successAlert(
              "Staff is activated",
            );
            this.staff = new StaffMaster();
            this.getStaffList();
          },
          (err: HttpErrorResponse) => {
            if (err.status === 200) {
              let jsonString = err.error.text;
              jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
            }
          }
        );
      }
    });
  }

  deactiveEntity($event){
    this.deactiveStaffConfirmation($event);
  }

  deactiveStaffConfirmation($event){
    Swal.fire({
      title: "Kindly confirm to Set Status deactive?",
      //text: "You able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deactivate it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let staff = new StaffMaster();
        const staffId = $event;
        staff.id = staffId.id;
         
        this.staffService.deactiveStaff(staff).subscribe(
          (data) => {  
            this.sweetAlertService.successAlert(
              "Staff is Deactivated",
            );
            this.staff = new StaffMaster();
            this.getStaffList();
          },
          (err: HttpErrorResponse) => {
            if (err.status === 200) {
              let jsonString = err.error.text;
              jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
            }
          }
        );
         
      }
    });
  }
  getStatusList() {
    let predefined = new PredefinedMaster();
    predefined.filterType = 'QUICK';
    predefined.moduleMaster = {
      "moduleCode": "FACTORY-MASTER"
    }
    this.predefinedService.getFilter(predefined).subscribe(
      (data) => {
        
        this.statusList = data.data;
        //console.log(this.statusList,'chiller status data');
        
       /* this.statusList.forEach(element => {
          const chiller = this.chiller.status ? this.chiller.status.id : '';
          if (chiller != '') {
            if (element.id == this.chiller.status.id) {
              this.chiller.status = element;
            }
          }
        });*/
        //if(this.chiller.status != null && this.chiller.status != undefined){
        //}
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }
}
