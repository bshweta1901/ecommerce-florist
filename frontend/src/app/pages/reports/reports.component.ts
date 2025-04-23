import { Component, OnInit, ViewChild } from '@angular/core';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';
import * as FileSaver from 'file-saver';
import { ChillerMaster } from 'src/app/model/ChillerMaster.model';
import { ChillerService } from 'src/app/service/chiller.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FactoryService } from 'src/app/service/factory.service';
import { Freezer } from 'src/app/model/Freezer.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  tableColsEvent: any[] = [];
  tableSettingsEvent: any = {};
  tableColsEventUnderUtilisation: any[] = [];
  tableSettingsEventUnderUtilisation: any = {};
  tableColsEventCapacity: any[] = [];
  tableSettingsEventCapacity: any = {};
  tableSettingsEventShrinkage: any = {};
  tableColsEventShrinkage: any[] = [];

  blastExtraCostTableColsEvent: any[] = [];
  blastExtraCostTableSettingsEvent: any = {};
  blastUtilizationTableColsEvent: any[] = [];
  blastUtilizationTableSettingsEvent: any = {};

  plateExtraCostTableColsEvent: any[] = [];
  plateExtraCostTableSettingsEvent: any = {};
  plateUtilizationTableColsEvent: any[] = [];
  plateUtilizationTableSettingsEvent: any = {};

  blastExtraCostTotalRecords:number;
  blastUtilizationTotalRecords:number;
  plateExtraCostTotalRecords: number;
  plateUtilizationTotalRecords: number;
  
  shrinkageList: any[] = [];
  chillerLogList: any[] = [];
  underUtilisationList: any[] = [];
  chillerExtraCostList: any[] = [];
  capacityList: any[] = [];
  eventList: any[] = [];
  totalRecords: number = 0;
  reportList: any[] = [];

  blastFreezerExtraCostList: any[] = [];
  blastFreezercapacityList: any[] = [];
  plateFreezerExtraCostList: any[] = [];
  plateFreezercapacityList: any[] = [];

  totalRecordsUnderUtilization: number = 0;
  totalRecordsCapacity: number;
  totalRecordsShrinkage: number;
  
  pageNumber: number = 0;
  pageSize: number = 10;
  factoryId:any;
  chillerFlag:boolean = false;
  blastFreezerFlag:boolean = false;
  plateFreezerFlag:boolean = false;
  @ViewChild('calendar') private calendar: any;
  chillerExtraCost: ChillerMaster = new ChillerMaster();
  chillerUnder : ChillerMaster = new ChillerMaster();
  chillerCapacity : ChillerMaster = new ChillerMaster();
  chillerShrinkage : ChillerMaster = new ChillerMaster();
  blastFreezerExtraCost: Freezer = new Freezer();
  blastFreezerCapacity : Freezer = new Freezer();
  plateFreezerExtraCost: Freezer = new Freezer();
  plateFreezerCapacity : Freezer = new Freezer();
  constructor(private sweetAlertService:SweetAlertService, private factoryService:FactoryService, private chillerService:ChillerService) { }

  ngOnInit(): void {

    this.reportList = [
      { label: 'Over Ran Chiller', value: 'chiller' },
      { label: 'Chiller Capacity Utilisation', value: 'blast_freezer' },
      { label: 'Average Carcass Shrinkage %', value: 'plate_freezer' },
      { label: 'Over Ran Blast Freezer', value: 'chiller' },
      { label: 'Blast Freezer Capacity Utilisation', value: 'blast_freezer' },
      { label: 'Over Ran Plate Freezer', value: 'plate_freezer' },
      { label: 'Plate Freezer Capacity Utilisation', value: 'plate_freezer' }
    ];

    this.setTableSetting();
    this.getUnderUtilizationList();
    this.getCapacityUtilizationList();
    this.getShrinkageUtilizationList();
    this.getExtraCostList();
    this.getBlastFreezerExtraCostList();
    this.getBlastFreezerUtilizationList();
    this.getPlateFreezerExtraCostList();
    this.getPlateFreezerUtilizationList();
  }

  onReportChange($event){
    console.log($event);
    if($event.value.value == 'chiller'){
        this.chillerFlag = true;
    }else if($event.value.value == 'blast_freezer'){
        this.blastFreezerFlag = true;
    }else if($event.value.value == 'plate_freezer'){
        this.plateFreezerFlag = true;
    }
  }

  setTableSetting() {
    
    // this.searchPlaceholder = "Chiller ";
    this.tableSettingsEvent = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
 allowExportxl:false,
      search: false
    };
    this.tableColsEvent = [
      // { field: 'id', header: 'Sr No.', fieldType: "text" },
      { field: 'chillerId', header: 'Chiller Id', fieldType: "text"},
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'extraMin', header: 'Extra Minutes', fieldType: "text"},
      { field: 'extraCost', header: 'Extra Cost', fieldType: "text"},
    ];


    // this.searchPlaceholder = "Chiller ";
    this.tableSettingsEventUnderUtilisation = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
 allowExportxl:false,
      search: false
    };
    this.tableColsEventUnderUtilisation = [
      // { field: 'id', header: 'Sr No.', fieldType: "text" },
      { field: 'chillerId', header: 'Chiller Id', fieldType: "text"},
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'average', header: 'Utilization %', fieldType: "text"},
      
    ];

    this.tableSettingsEventCapacity = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
      allowExportxl:false,
      search: false
    };
    
    this.tableColsEventCapacity = [
      { field: 'chillerId', header: 'Chiller Id', fieldType: "text" },
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'average', header: 'Utilization %', fieldType: "text"},
    ];

    this.tableSettingsEventShrinkage = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
 allowExportxl:false,
      search: false
    };
    
    this.tableColsEventShrinkage = [
      { field: 'chillerId', header: 'Chiller Id', fieldType: "text" },
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'average', header: 'Utilization %', fieldType: "text"},
    ];


    this.blastExtraCostTableSettingsEvent = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
 allowExportxl:false,
      search: false
    };
    this.blastExtraCostTableColsEvent = [
      // { field: 'id', header: 'Sr No.', fieldType: "text" },
      { field: 'freezerId', header: 'Freezer Id', fieldType: "text"},
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'extraMin', header: 'Extra Minutes', fieldType: "text"},
      { field: 'extraCost', header: 'Extra Cost', fieldType: "text"},
    ];

    this.blastUtilizationTableSettingsEvent = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
 allowExportxl:false,
      search: false
    };
    
    this.blastUtilizationTableColsEvent = [
      { field: 'freezerId', header: 'Freezer Id', fieldType: "text" },
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'average', header: 'Utilization %', fieldType: "text"},
    ];
  
    this.plateExtraCostTableSettingsEvent = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
 allowExportxl:false,
      search: false
    };
    this.plateExtraCostTableColsEvent = [
      // { field: 'id', header: 'Sr No.', fieldType: "text" },
      { field: 'freezerId', header: 'Freezer Id', fieldType: "text"},
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'extraMin', header: 'Extra Minutes', fieldType: "text"},
      { field: 'extraCost', header: 'Extra Cost', fieldType: "text"},
    ];

    this.plateUtilizationTableSettingsEvent = {
      // tableFilter: false,
      add: false,
      action: false,
      filter: false,
      clear: false,
      export: false,
      paginate: true,
      delete: false,
      edit: false,
      view: false,
      active: false,
      deactive: false,
       allowExport: true,
 allowExportxl:false,
      search: false
    };
    
    this.plateUtilizationTableColsEvent = [
      { field: 'freezerId', header: 'Freezer Id', fieldType: "text" },
      { field: 'logDate', header: 'Log Date', fieldType: "dateTime"},
      { field: 'average', header: 'Utilization %', fieldType: "text"},
    ];
  
  }

  onSelect(){
    //console.log("asd")
      if (this.chillerUnder.rangeDates[1]) { // If second date is selected
        this.calendar.overlayVisible=false;
    }
  }

  getDateRange(){
    
    if(this.chillerUnder.rangeDates != null && this.chillerUnder.rangeDates != undefined){
      this.chillerUnder.fromDate = this.chillerUnder.rangeDates[0];
      this.chillerUnder.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.chillerUnder.toDate = this.chillerUnder.rangeDates[1];
      this.chillerUnder.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getUnderUtilizationList();

      this.chillerCapacity.fromDate = this.chillerUnder.rangeDates[0];
      this.chillerCapacity.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.chillerCapacity.toDate = this.chillerUnder.rangeDates[1];
      this.chillerCapacity.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getCapacityUtilizationList();

      this.chillerShrinkage.fromDate = this.chillerUnder.rangeDates[0];
      this.chillerShrinkage.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.chillerShrinkage.toDate = this.chillerUnder.rangeDates[1];
      this.chillerShrinkage.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getShrinkageUtilizationList();

      this.chillerExtraCost.fromDate = this.chillerUnder.rangeDates[0];
      this.chillerExtraCost.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.chillerExtraCost.toDate = this.chillerUnder.rangeDates[1];
      this.chillerExtraCost.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getExtraCostList();

      this.blastFreezerExtraCost.fromDate = this.chillerUnder.rangeDates[0];
      this.blastFreezerExtraCost.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.blastFreezerExtraCost.toDate = this.chillerUnder.rangeDates[1];
      this.blastFreezerExtraCost.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getBlastFreezerExtraCostList();

      this.blastFreezerCapacity.fromDate = this.chillerUnder.rangeDates[0];
      this.blastFreezerCapacity.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.blastFreezerCapacity.toDate = this.chillerUnder.rangeDates[1];
      this.blastFreezerCapacity.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getBlastFreezerUtilizationList();

      this.plateFreezerExtraCost.fromDate = this.chillerUnder.rangeDates[0];
      this.plateFreezerExtraCost.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.plateFreezerExtraCost.toDate = this.chillerUnder.rangeDates[1];
      this.plateFreezerExtraCost.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getPlateFreezerExtraCostList();

      this.plateFreezerCapacity.fromDate = this.chillerUnder.rangeDates[0];
      this.plateFreezerCapacity.fromDate= new Date(this.chillerUnder.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.plateFreezerCapacity.toDate = this.chillerUnder.rangeDates[1];
      this.plateFreezerCapacity.toDate= new Date(this.chillerUnder.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      this.getPlateFreezerUtilizationList();
    }
  }

  paginateEvent(event) {
    this.pageSize = event.rows;
    this.chillerExtraCost.pageNumber = event.page;
    this.chillerExtraCost.pageSize = this.pageSize;

    // this.auth.setFilterSessionData("Filter",this.chiller);
    this.getExtraCostList();
  }

  paginateEventUnderUtilization(event) {
    this.pageSize = event.rows;
    this.chillerUnder.pageNumber = event.page;
    this.chillerUnder.pageSize = this.pageSize;

    // this.auth.setFilterSessionData("Filter",this.chiller);
    this.getUnderUtilizationList();
  }

  paginateEventCapacity(event) {
    this.pageSize = event.rows;
    this.chillerCapacity.pageNumber = event.page;
    this.chillerCapacity.pageSize = this.pageSize;

    // this.auth.setFilterSessionData("Filter",this.chiller);
    this.getCapacityUtilizationList();
  }

  paginateEventShrinkage(event) {
    this.pageSize = event.rows;
    this.chillerShrinkage.pageNumber = event.page;
    this.chillerShrinkage.pageSize = this.pageSize;

    // this.auth.setFilterSessionData("Filter",this.chiller);
    this.getShrinkageUtilizationList();
  }

  paginateEventBlast(event) {
    this.pageSize = event.rows;
    this.blastFreezerExtraCost.pageNumber = event.page;
    this.blastFreezerExtraCost.pageSize = this.pageSize;

    // this.auth.setFilterSessionData("Filter",this.chiller);
    this.getBlastFreezerExtraCostList();
  }

  searchData($event){
    // this.chiller.searchValue= $event;
    // this.getChillerList();
  }

  getExportName(): string {
    return 'Chiller Under utilization List'; // Set the export filename based on the component name.
  }

  exportEntity() {
    let newarray = []
 
    if(this.tableColsEventCapacity.length==0){
      this.sweetAlertService.infoAlert(
        "No data available"
      );
    }else{
      //console.log(this.eventList,'excel list');
      this.underUtilisationList.forEach((arr) => {
        let obj = {}
        this.tableColsEventCapacity.forEach((element) => {
          if (element.header == 'Chiller Id') {
            obj[`${element.header}`] = arr?.chillerId
          }else if(element.header == 'Log Date'){
            obj[`${element.header}`] = arr?.logDate
          }else if(element.header == 'Utilization %'){
            obj[`${element.header}`] = arr?.average
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
    FileSaver.saveAs(data, "Chiller cycle log List");
  }

  getExtraCostList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.chillerExtraCost.factoryId = this.factoryId.factoryId;
    // this.chillerUnder.reportFor = "UNDER_UTILIZATION";

  
    this.chillerExtraCost.pageNumber = this.chillerExtraCost?.pageNumber ? this.chillerExtraCost?.pageNumber : this.pageNumber;
    this.chillerExtraCost.pageSize = this.chillerExtraCost?.pageSize ? this.chillerExtraCost?.pageSize : this.pageSize;
      //console.log(this.chillerReading, 'reading');
    this.chillerService.getExtraCostUtilized(this.chillerExtraCost).subscribe(
        (data) => {
          
          this.chillerExtraCostList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getExtraCostLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getExtraCostLength() {  
      
    this.chillerExtraCost.pageNumber = this.chillerExtraCost?.pageNumber ? this.chillerExtraCost?.pageNumber : this.pageNumber;
    this.chillerExtraCost.pageSize = this.chillerExtraCost?.pageSize ? this.chillerExtraCost?.pageSize : this.pageSize;
 
    this.chillerService.getExtraCostLength(this.chillerExtraCost).subscribe(
      (data) => {
        //console.log(data);
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



  getUnderUtilizationList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.chillerUnder.factoryId = this.factoryId.factoryId;
    this.chillerUnder.reportFor = "UNDER_UTILIZATION";

  
    this.chillerUnder.pageNumber = this.chillerUnder?.pageNumber ? this.chillerUnder?.pageNumber : this.pageNumber;
    this.chillerUnder.pageSize = this.chillerUnder?.pageSize ? this.chillerUnder?.pageSize : this.pageSize;
      //console.log(this.chillerReading, 'reading');
    this.chillerService.getUnderUtilized(this.chillerUnder).subscribe(
        (data) => {
          
          this.underUtilisationList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getUnderUtilizationLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getUnderUtilizationLength() {  
      
    this.chillerUnder.pageNumber = this.chillerUnder?.pageNumber ? this.chillerUnder?.pageNumber : this.pageNumber;
    this.chillerUnder.pageSize = this.chillerUnder?.pageSize ? this.chillerUnder?.pageSize : this.pageSize;
 
    this.chillerService.getUnderUtilizedLength(this.chillerUnder).subscribe(
      (data) => {
        //console.log(data);
        this.totalRecordsUnderUtilization = data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }

  getCapacityUtilizationList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.chillerCapacity.factoryId = this.factoryId.factoryId;
    this.chillerCapacity.reportFor = "CAPACITY_UTILIZATION";
    this.chillerCapacity.pageNumber = this.chillerCapacity?.pageNumber ? this.chillerCapacity?.pageNumber : this.pageNumber;
    this.chillerCapacity.pageSize = this.chillerCapacity?.pageSize ? this.chillerCapacity?.pageSize : this.pageSize;
      //console.log(this.chillerReading, 'reading');
    this.chillerService.getCapacityUtilized(this.chillerCapacity).subscribe(
        (data) => {
          
          this.capacityList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getCapacityUtilizationLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getCapacityUtilizationLength() {  
      
    this.chillerCapacity.pageNumber = this.chillerCapacity?.pageNumber ? this.chillerCapacity?.pageNumber : this.pageNumber;
    this.chillerCapacity.pageSize = this.chillerCapacity?.pageSize ? this.chillerCapacity?.pageSize : this.pageSize;
 
    this.chillerService.getCapacityUtilizedLength(this.chillerCapacity).subscribe(
      (data) => {
        //console.log(data);
        this.totalRecordsCapacity = data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }


  getShrinkageUtilizationList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.chillerShrinkage.factoryId = this.factoryId.factoryId;
    this.chillerShrinkage.reportFor = "SHRINAKGE";
    this.chillerShrinkage.pageNumber = this.chillerShrinkage?.pageNumber ? this.chillerShrinkage?.pageNumber : this.pageNumber;
    this.chillerShrinkage.pageSize = this.chillerShrinkage?.pageSize ? this.chillerShrinkage?.pageSize : this.pageSize;
      //console.log(this.chillerReading, 'reading');
    this.chillerService.getShrinkageUtilized(this.chillerShrinkage).subscribe(
        (data) => {
          
          this.shrinkageList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getShrinkageUtilizationLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getShrinkageUtilizationLength() {  
      
    this.chillerShrinkage.pageNumber = this.chillerShrinkage?.pageNumber ? this.chillerShrinkage?.pageNumber : this.pageNumber;
    this.chillerShrinkage.pageSize = this.chillerShrinkage?.pageSize ? this.chillerShrinkage?.pageSize : this.pageSize;
 
    this.chillerService.getShrinkageUtilizedLength(this.chillerShrinkage).subscribe(
      (data) => {
        //console.log(data);
        this.totalRecordsShrinkage = data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }


  getBlastFreezerExtraCostList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.blastFreezerExtraCost.factoryId = this.factoryId.factoryId;
    this.blastFreezerExtraCost.reportFor = "EXTRA_COST";
    this.blastFreezerExtraCost.freezerCode = "BLAST";
  
    this.blastFreezerExtraCost.pageNumber = this.blastFreezerExtraCost?.pageNumber ? this.blastFreezerExtraCost?.pageNumber : this.pageNumber;
    this.blastFreezerExtraCost.pageSize = this.blastFreezerExtraCost?.pageSize ? this.blastFreezerExtraCost?.pageSize : this.pageSize;
    //console.log(this.chillerReading, 'reading');
    this.chillerService.getBlastExtraCostUtilized(this.blastFreezerExtraCost).subscribe(
        (data) => {
          
          this.blastFreezerExtraCostList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getBlastExtraCostLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getBlastExtraCostLength() {  
      
    this.blastFreezerExtraCost.pageNumber = this.blastFreezerExtraCost?.pageNumber ? this.blastFreezerExtraCost?.pageNumber : this.pageNumber;
    this.blastFreezerExtraCost.pageSize = this.blastFreezerExtraCost?.pageSize ? this.blastFreezerExtraCost?.pageSize : this.pageSize;
 
    this.chillerService.getBlastExtraCostLength(this.blastFreezerExtraCost).subscribe(
      (data) => {
        //console.log(data);
        this.blastExtraCostTotalRecords = data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }

  getBlastFreezerUtilizationList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.blastFreezerCapacity.factoryId = this.factoryId.factoryId;
    this.blastFreezerCapacity.reportFor = "CAPACITY_UTILIZATION";
    this.blastFreezerCapacity.freezerCode = "BLAST";
  
    this.blastFreezerCapacity.pageNumber = this.blastFreezerCapacity?.pageNumber ? this.blastFreezerCapacity?.pageNumber : this.pageNumber;
    this.blastFreezerCapacity.pageSize = this.blastFreezerCapacity?.pageSize ? this.blastFreezerCapacity?.pageSize : this.pageSize;
      //console.log(this.chillerReading, 'reading');
    this.chillerService.getBlastUtilized(this.blastFreezerCapacity).subscribe(
        (data) => {
          
          this.blastFreezercapacityList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getBlastUtilizationLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getBlastUtilizationLength() {  
      
    this.blastFreezerCapacity.pageNumber = this.blastFreezerCapacity?.pageNumber ? this.blastFreezerCapacity?.pageNumber : this.pageNumber;
    this.blastFreezerCapacity.pageSize = this.blastFreezerCapacity?.pageSize ? this.blastFreezerCapacity?.pageSize : this.pageSize;
 
    this.chillerService.getBlastUtilizationLength(this.blastFreezerCapacity).subscribe(
      (data) => {
        //console.log(data);
        this.blastUtilizationTotalRecords = data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }


  getPlateFreezerExtraCostList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.plateFreezerExtraCost.factoryId = this.factoryId.factoryId;
    this.plateFreezerExtraCost.reportFor = "EXTRA_COST";
    this.plateFreezerExtraCost.freezerCode = "BLAST";
  
    this.plateFreezerExtraCost.pageNumber = this.plateFreezerExtraCost?.pageNumber ? this.plateFreezerExtraCost?.pageNumber : this.pageNumber;
    this.plateFreezerExtraCost.pageSize = this.plateFreezerExtraCost?.pageSize ? this.plateFreezerExtraCost?.pageSize : this.pageSize;
    
      //console.log(this.chillerReading, 'reading');
    this.chillerService.getBlastExtraCostUtilized(this.plateFreezerExtraCost).subscribe(
        (data) => {
          
          this.plateFreezerExtraCostList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getPlateExtraCostLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getPlateExtraCostLength() {  
      
    this.blastFreezerExtraCost.pageNumber = this.blastFreezerExtraCost?.pageNumber ? this.blastFreezerExtraCost?.pageNumber : this.pageNumber;
    this.blastFreezerExtraCost.pageSize = this.blastFreezerExtraCost?.pageSize ? this.blastFreezerExtraCost?.pageSize : this.pageSize;
 
    this.chillerService.getBlastExtraCostLength(this.blastFreezerExtraCost).subscribe(
      (data) => {
        //console.log(data);
        this.plateExtraCostTotalRecords = data.data;
      },
      (err: HttpErrorResponse) => {
        if (err.status === 200) {
          let jsonString = err.error.text;
          jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
        }
      }
    );
  }

  getPlateFreezerUtilizationList() {
    this.factoryId = this.factoryService.getFactorySession();
    this.blastFreezerCapacity.factoryId = this.factoryId.factoryId;
    this.blastFreezerCapacity.reportFor = "CAPACITY_UTILIZATION";
    this.blastFreezerCapacity.freezerCode = "PLATE";
  
    this.blastFreezerCapacity.pageNumber = this.blastFreezerCapacity?.pageNumber ? this.blastFreezerCapacity?.pageNumber : this.pageNumber;
    this.blastFreezerCapacity.pageSize = this.blastFreezerCapacity?.pageSize ? this.blastFreezerCapacity?.pageSize : this.pageSize;
      //console.log(this.chillerReading, 'reading');
    this.chillerService.getBlastUtilized(this.blastFreezerCapacity).subscribe(
        (data) => {
          
          this.plateFreezercapacityList = data.data;
        // console.log(this.eventList,'chiller Reading list');
          this.getPlateUtilizationLength();
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"}'));
          }
        }
      );
    }
  

  getPlateUtilizationLength() {  
      
    this.blastFreezerCapacity.pageNumber = this.blastFreezerCapacity?.pageNumber ? this.blastFreezerCapacity?.pageNumber : this.pageNumber;
    this.blastFreezerCapacity.pageSize = this.blastFreezerCapacity?.pageSize ? this.blastFreezerCapacity?.pageSize : this.pageSize;
 
    this.chillerService.getBlastUtilizationLength(this.blastFreezerCapacity).subscribe(
      (data) => {
        //console.log(data);
        this.plateUtilizationTotalRecords = data.data;
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
