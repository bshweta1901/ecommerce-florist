import { Component, OnInit, ViewChild } from '@angular/core';
import { ChillerMaster } from 'src/app/model/ChillerMaster.model';
import { Freezer } from 'src/app/model/Freezer.model';
import * as FileSaver from 'file-saver';
import { ChillerService } from 'src/app/service/chiller.service';
import { Factory } from 'src/app/model/Factory.model';
import { FactoryService } from 'src/app/service/factory.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  fileSave:any;
  chiller: ChillerMaster = new ChillerMaster();
  shrinkage : ChillerMaster = new ChillerMaster();
  @ViewChild('calendar') private calendar: any;
  blastFreezer: ChillerMaster = new ChillerMaster();
  plateFreezer : ChillerMaster = new ChillerMaster();
  factory: Factory = new Factory();
  reportList: any[] = [];
  selectedReport: any;
  selectedDates: Date[];
  constructor(private chillerService: ChillerService, private factoryService: FactoryService) { }

  ngOnInit(): void {
    this.setInitialDateRange();
    
    this.reportList = [
      { label: 'Chiller Report', value: 'chiller' },
      { label: 'Shrinkage % Report', value: 'shrinkage' },
      { label: 'Blast Freezer Report', value: 'blast_freezer' },
      { label: 'Plate Freezer Report', value: 'plate_freezer' },
    ];

  }

  setInitialDateRange() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.selectedDates = [firstDayOfMonth, lastDayOfMonth];
  }

  onSelect(){
    //console.log("asd")
      if (this.chiller.rangeDates[1]) { // If second date is selected
        this.calendar.overlayVisible=false;
    }
  }

  getDateRange(){
    
    if(this.chiller.rangeDates != null && this.chiller.rangeDates != undefined){
      this.chiller.fromDate = this.chiller.rangeDates[0];
      this.chiller.fromDate= new Date(this.chiller.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.chiller.toDate = this.chiller.rangeDates[1];
      this.chiller.toDate= new Date(this.chiller.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      // this.getUnderUtilizationList();

      this.shrinkage.fromDate = this.chiller.rangeDates[0];
      this.shrinkage.fromDate= new Date(this.chiller.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.shrinkage.toDate = this.chiller.rangeDates[1];
      this.shrinkage.toDate= new Date(this.chiller.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      // this.getShrinkageUtilizationList();

      this.blastFreezer.fromDate = this.chiller.rangeDates[0];
      this.blastFreezer.fromDate= new Date(this.chiller.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.blastFreezer.toDate = this.chiller.rangeDates[1];
      this.blastFreezer.toDate= new Date(this.chiller.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      // this.getExtraCostList();

      this.plateFreezer.fromDate = this.chiller.rangeDates[0];
      this.plateFreezer.fromDate= new Date(this.chiller.fromDate.getTime() + +((5.5 * 60) * 60 * 1000));
      //console.log(this.events.fromDate, 'from date');
      this.plateFreezer.toDate = this.chiller.rangeDates[1];
      this.plateFreezer.toDate= new Date(this.chiller.toDate.getTime() + +((5.5 * 60) * 60 * 1000));
      // this.getBlastFreezerExtraCostList();

      
    }
  }

  onReportSelect(event: any) {
    this.selectedReport = event.value;
    console.log('Selected report:', this.selectedReport); // Optional: log the selected report
    // Additional actions on report select
  }

  download()
  {
    if(this.selectedReport.value == 'chiller'){
      this.exportData();
    }else if(this.selectedReport.value == 'shrinkage'){
      // console.log(this.shrinkage, 'shrinkage');
      this.exportShrinkageData();
    }else if(this.selectedReport.value == 'blast_freezer'){
      this.exportBlastFreezerData();
    }else if(this.selectedReport.value == 'plate_freezer'){
      this.exportPlateFreezerData();
    }
  }

  exportData(){
    if (this.selectedDates && this.selectedDates.length === 2) {
      this.chiller = new ChillerMaster();
      const [startDate, endDate] = this.selectedDates;
      
      this.chiller.fromDate = startDate; 
      this.chiller.toDate = endDate;
      
      this.factory = this.factoryService.getFactorySession();
      this.chiller.factoryId = this.factory.factoryMaster.id;
  
      this.chiller.reportFor = 'CHILLER';

      console.log(this.chiller, 'chiller');
      this.chillerService.getShrinakgeReport(this.chiller).subscribe(
        (data:any) => {
          const url = data.data.FileLink;
          //console.log(data,'excel data');
          this.downloadPDF(url);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
          }
        }
      );
    }
  }


  exportBlastFreezerData(){
    if (this.selectedDates && this.selectedDates.length === 2) {
      this.blastFreezer = new ChillerMaster();
      const [startDate, endDate] = this.selectedDates;
      
      this.blastFreezer.fromDate = startDate; 
      this.blastFreezer.toDate = endDate;
      
      this.factory = this.factoryService.getFactorySession();
      this.blastFreezer.factoryId = this.factory.factoryMaster.id;
  
      this.blastFreezer.reportFor = 'BLAST';

      this.chillerService.getShrinakgeReport(this.blastFreezer).subscribe(
        (data:any) => {
          const url = data.data.FileLink;
          //console.log(data,'excel data');
          this.downloadPDF(url);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
          }
        }
      );
    }
  }


  exportPlateFreezerData(){
    if (this.selectedDates && this.selectedDates.length === 2) {
      this.plateFreezer = new ChillerMaster();
      const [startDate, endDate] = this.selectedDates;
      
      this.plateFreezer.fromDate = startDate; 
      this.plateFreezer.toDate = endDate;
      
      this.factory = this.factoryService.getFactorySession();
      this.plateFreezer.factoryId = this.factory.factoryMaster.id;
  
      this.plateFreezer.reportFor = 'PLATE';

      this.chillerService.getShrinakgeReport(this.plateFreezer).subscribe(
        (data:any) => {
          const url = data.data.FileLink;
          //console.log(data,'excel data');
          this.downloadPDF(url);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
          }
        }
      );
    }
  }


  exportShrinkageData()
  {
    if (this.selectedDates && this.selectedDates.length === 2) {
      this.shrinkage = new ChillerMaster();
      const [startDate, endDate] = this.selectedDates;
      
      this.shrinkage.fromDate = startDate; 
      this.shrinkage.toDate = endDate;
      
      this.factory = this.factoryService.getFactorySession();
      this.shrinkage.factoryId = this.factory.factoryMaster.id;
  
      this.shrinkage.reportFor = 'SHRINKAGE';

      this.chillerService.getShrinakgeReport(this.shrinkage).subscribe(
        (data:any) => {
          const url = data.data.FileLink;
          //console.log(data,'excel data');
          this.downloadPDF(url);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 200) {
            let jsonString = err.error.text;
            jsonString = jsonString.substr(0, jsonString.indexOf('{"timestamp"'));
          }
        }
      );
    }
  }

  downloadPDF(url: string) {
    this.chillerService.downloadPDF(url).subscribe((data: Blob) => {
        this.fileSave = data;
        //console.log(data, 'data.data.file');
        const pdfData: Blob = new Blob([data], { type: 'application/xlsx' });
        //console.log(pdfData, 'pdfData');
        const urlParts = url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        //console.log(fileName, 'fileName');
        // const fileName: string = 'ThematicReport.pdf';
        FileSaver.saveAs(data, fileName);
      });
  }


}
