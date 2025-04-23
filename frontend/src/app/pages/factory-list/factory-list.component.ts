import { PredefinedService } from './../../service/predefined.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Factory } from 'src/app/model/Factory.model';
import { FactoryService } from 'src/app/service/factory.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { PredefinedMaster } from 'src/app/model/PredefinedMaster.model';

@Component({
  selector: 'app-factory-list',
  templateUrl: './factory-list.component.html',
  styleUrls: ['./factory-list.component.scss']
})
export class FactoryListComponent implements OnInit {

  titleEVent: any
  titleUpdateEVent: any
  tableColsEvent: any[] = [];
  tableSettingsEvent: any = {};
  totalRecords: number;
  eventList: any[] = [];
  openAddDialogModuleEvent: boolean = false;
  openUpdateDialogModuleEvent: boolean = false;
  hideButtonView: boolean = false;
  getRemoteConfigResponse: any;
  hideUpdateButtonView: boolean = false;
  factory: Factory = new Factory();
  pageSize: number = 10;
  pageNumber: number = 0;
  searchPlaceholder : string = null;
  statusList:any[]=[];
  visibleSidebar:boolean=false;
  visibleSidebar2:boolean=false;
  selectedValue:any;
  constructor(public factoryService: FactoryService, private sweetAlertService:SweetAlertService,public predefinedService:PredefinedService) { }

  ngOnInit(): void {
    this.setTableSetting();
    this.getFactoryList();
    this.getStatusList();
  }

  setTableSetting() {
    let pageNumber = this.factory?.pageNumber? this.factory?.pageNumber: this.pageNumber
    let pageSize = this.factory?.pageNumber? this.factory?.pageSize: this.pageSize
    let paginatorSize = pageNumber * pageSize;
    this.searchPlaceholder = "Factory Name";
    this.tableSettingsEvent = {
      // tableFilter: false,
      add: true,
      action: true,
      filter: true,
      clear: true,
      export: true,
      paginate: true,
      delete: false,
      deactive:false,
      active:false,
      edit: true,
      view: false,
       allowExport: true,
 allowExportxl:false,
      paginateSize: paginatorSize,
    };
    this.tableColsEvent = [
      { field: 'factoryName', header: 'Factory Name', fieldType: "text" },
      { field: 'code', header:'Factory Abbreviation', fieldType:'text'},
      { field: 'location', header: 'Location', fieldType: "text" },
      { field: 'isDeactivate', header: 'Status', fieldType: 'status' },
    ];
  }


  addEvent(){
    this.titleEVent="Add Factory"
    this.openAddDialogModuleEvent=true;
    this.factory = new Factory();
    this.hideButtonView=true;
  }

  getExportName(): string {
    return 'Factory List'; // Set the export filename based on the component name.
  }

  EditEvent($event){
    this.titleEVent="Update Factory"
    this.factory = $event;
    this.factoryService.setFactorySession(this.factory);
    this.getFactoryById(this.factory);
    // console.log(this.project, "update project");
    
  }

  resetSearch($event){

  }
  openSidebar(){
    this.visibleSidebar = true;
    // this.getFactoryList();
  }
  searchFilter() {
    this.getFactoryList();
    this.visibleSidebar = false;
  }
 
  resetFilter() {
    this.factory = new Factory();
    this.selectedValue = {};
  this.getFactoryList();
  this.visibleSidebar = false;

  }  
  searchData($event){
    this.factory.searchValue = $event;
    this.getFactoryList();
  }

  getFactoryById(factory:Factory){
    this.factory=factory;    
    //console.log(this.service, "service id data");
    this.factoryService.getFactoryById(this.factory).subscribe(
      (data) => {  
          //console.log(data.data, 'service data');
          this.factory=data.data;
          this.factoryService.setFactorySession(this.factory);
          this.openAddDialogModuleEvent=true;
          this.hideButtonView=false;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
        }
      }
    );
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

  deleteEvent(event){
    //console.log(event);
    if(event.isDeactivate == 'N')
    {
      var title = "Kindly deactive the product before deleting?";
      this.deactiveFactoryConfirmation(event);
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
                  let factory = new Factory();
                  const productId = event;
                  factory.uuid = productId.uuid;
                  this.factoryService.deleteFactoryById(factory).subscribe(
                    (data) => {
                      Swal.fire(
                          "Deleted!",
                          "Factory deleted successfully.",
                          "success"
                      );
                      this.getFactoryList();
                    },
                    (error) => {
                        if (error instanceof HttpErrorResponse) {
                            if (error.status === 200) {
                                Swal.fire(
                                    "Deleted!",
                                    "Factory deleted successfully.",
                                    "success"
                                );
                                this.getFactoryList();
                            } else {
                            }
                        }
                    }
                  );
                }
      });
    }
    
  }

  deactiveEntity($event){
    this.deactiveFactoryConfirmation($event);
  }

  deactiveFactoryConfirmation($event){
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
        let factory = new Factory();
        const productId = $event;
        // console.log(productId);
        factory.uuid = productId.uuid;
         
        this.factoryService.statusFactoryById(factory).subscribe(
          (data) => {  
            this.sweetAlertService.successAlert(
              "Factory is Deactivated",
            );
            this.factory = new Factory();
            this.getFactoryList();
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

  activeEntity($event){
    this.activeFactoryConfirmation($event);
  }

  activeFactoryConfirmation($event){
    Swal.fire({
      title: "Kindly confirm to Set Status active?",
      //text: "You able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, active it!"
    }).then((result) => {
      if (result.isConfirmed) {
        let factory = new Factory();
        const productId = $event;
        factory.uuid = productId.uuid;
         
        this.factoryService.statusFactoryById(factory).subscribe(
          (data) => {  
            this.sweetAlertService.successAlert(
              "Factory is Activated",
            );
            this.factory = new Factory();
            this.getFactoryList();
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

  closeEventDialog(){
    this.openAddDialogModuleEvent=false;
  }

  saveEventDialog(){
    this.openAddDialogModuleEvent=false;
    this.factory = new Factory();
    this.getFactoryList();
  }

  closeUpdateEventDialog(){
    this.openUpdateDialogModuleEvent=false;
    this.getFactoryList();
  }

  paginateEvent(event) {
    this.pageSize = event.rows;
    this.factory.pageNumber = event.page;
    this.factory.pageSize = this.pageSize;

    // this.auth.setFilterSessionData("Filter",this.project);
    this.getFactoryList();
  }
  onDropdownChange(event: any) {
    this.selectedValue = event.value;
    console.log('Selected Value:', this.selectedValue);
  }
  getFactoryList() {
    
    // this.factory = this.factoryService.getFactorySession();
    // console.log(  this.factory,"  this.factory");
    // this.factory.factoryMaster = this.factory.factoryMaster;

    this.factory.pageNumber = this.factory?.pageNumber ? this.factory?.pageNumber : this.pageNumber;
    this.factory.pageSize = this.factory?.pageSize ? this.factory?.pageSize : this.pageSize;
      
        this.factory.isDeactivate = this.selectedValue?.lookupValue;
      
    //console.log(this.chiller, 'factory');

    this.factoryService.getFactoryList(this.factory).subscribe(
      (data) => {
        
        this.eventList = data.data;
        //console.log(this.eventList,'chiller list');
        this.getFactoryListLength();
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }

  getFactoryListLength() {
        
    this.factory.pageNumber = this.factory?.pageNumber ? this.factory?.pageNumber : this.pageNumber;
    this.factory.pageSize = this.factory?.pageSize ? this.factory?.pageSize : this.pageSize;

    this.factoryService.getFactoryListLength(this.factory).subscribe(
      (data) => {
        this.totalRecords = data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }

  exportEntity() {
    let newarray = []
 
    if(this.eventList.length==0){
      this.sweetAlertService.infoAlert(
        "No data available"
      );
    }else{
      //console.log(this.eventList,'excel list');
      this.eventList.forEach((arr) => {
        let obj = {}
        this.tableColsEvent.forEach((element) => {
          if (element.header == 'Factory Name') {
            obj[`${element.header}`] = arr?.factoryName
          }else if(element.header == 'Factory code'){
            obj[`${element.header}`] = arr?.code
          }else if(element.header == 'Location'){
            obj[`${element.header}`] = arr?.location
          }else if(element.header == 'Status'){          
            if(arr?.isDeactivate == 'N')
            {
              obj[`${element.header}`] = 'Active'
            }else{
              obj[`${element.header}`] = 'Deactive'
            }
          }
        })
        newarray.push(obj)
 
      })
 
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
    FileSaver.saveAs(data, "Factory List");
  }

}
