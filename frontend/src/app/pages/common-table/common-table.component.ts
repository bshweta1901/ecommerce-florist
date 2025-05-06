import {
    Component,
    OnInit,
    Output,
    Input,
    EventEmitter,
    ViewChild,
} from "@angular/core";
import { Table } from "primeng/table";
import { Product } from "../../demo/domain/product";
import { ProductService } from "../../demo/service/productservice";
import { ConfirmationService, MessageService } from "primeng/api";
import { AppBreadcrumbService } from "../../app.breadcrumb.service";
import { outputAst } from "@angular/compiler";
import { RouterLink } from "@angular/router";
import { AuthService } from "src/app/service/auth.service";

interface Column {
    field: string;
    header: string;
}

@Component({
    selector: "app-common-table",
    templateUrl: "./common-table.component.html",
    styleUrls: ["./common-table.component.scss"],
})
export class CommonTableComponent implements OnInit {

    products!: Product[];
    selectedColumns: any[];
    cols!: Column[];
    isExpanded: boolean = false;
    loading: boolean = true;
    isImageModalVisible: boolean = false;
    src: string;
    hideButtonView: boolean = false;
    @Output() genericTableSettingForViewEvent: EventEmitter<any> =
        new EventEmitter();
    @Output() addEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() filterEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() exportEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() viewEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() searchEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() resetEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() paginateEvent: EventEmitter<any> = new EventEmitter();
    @Output() viewDocumentEvent: EventEmitter<any> = new EventEmitter();
    @Output() downloadDocumentEvent: EventEmitter<any> = new EventEmitter();
    @Output() deleteDataEvent: EventEmitter<any> = new EventEmitter();
    @Output() deactiveDataEvent: EventEmitter<any> = new EventEmitter();
    @Output() activeDataEvent: EventEmitter<any> = new EventEmitter();
    @Output() archiveDataEvent: EventEmitter<any> = new EventEmitter();
    @Output() bulkUpdateEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() editEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() changeViewEvent: EventEmitter<any> = new EventEmitter();
    @Output() downloadDataEvent: EventEmitter<any> = new EventEmitter();
    @Output() viewLogsDataEntity: EventEmitter<any> = new EventEmitter();
    @Output() rowDataEdit: EventEmitter<any> = new EventEmitter();
    @Output() rowDataEditUnload: EventEmitter<any> = new EventEmitter();
    @Output() openAddDialogModuleEvent: EventEmitter<any> = new EventEmitter();
    @Output() openEditModal: EventEmitter<any> = new EventEmitter();
    @Output() activeDeactiveEvent:EventEmitter<any> = new EventEmitter();

    @Output() openAddDialogModuleEventForSparePartRequest: EventEmitter<any> =
        new EventEmitter();
    @Output() openAddDialogModuleEventForOnDemand: EventEmitter<any> =
        new EventEmitter();
    @Output() openAddDialogModuleEventForUpdateStatus: EventEmitter<any> =
        new EventEmitter();
    @Output() addReceiptEvent: EventEmitter<any> =
        new EventEmitter();
    @Output() reassignForServiceRequestEntityEvent: EventEmitter<any> =
        new EventEmitter();
    @Output() addRepairCheckEntityEvent: EventEmitter<any> = new EventEmitter();
    @Output() addProblemDiagnosisEntityEvent: EventEmitter<any> =
        new EventEmitter();
    @Output() resheduleForServiceRequestEntityEvent: EventEmitter<any> =
        new EventEmitter();
    @Output() orderStatusForOrderDetailsEntityEvent: EventEmitter<any> =
        new EventEmitter();

    @Input() genericTableSettingInput: any;
    @Input() genericAddData: any;
    @Input() title: string;
    @Input() genericColsInput: any[] = [];
    @Input() genericListInput: any[] = [];
    @Input() enableFilter: boolean = false;
    @Input() totalRecords: number = 100;
    @Input() exportName: string;
    @Input() placeholder: string;
    searchText: string = "";
    @Output() searchEmitter = new EventEmitter<string>();
    emptyMessage = "No data available";
    columnLength: number = 3;
    @ViewChild("dt") table: Table;
    @Input() dummyData: any[] = [];
  
    roundUp(value: number): number {
        return Math.ceil(value);
    }

    toggleSearch() {
        this.isExpanded = !this.isExpanded;
    }

    onSearch() {
        this.searchEmitter.emit(this.searchText);
    }

    visibleSidebar2;

    constructor(private productService: ProductService, private authService: AuthService) {}

    ngOnInit() {
        this.selectedColumns = this.genericColsInput;
        // this.statusForServiceRequest();
        //console.log(this.totalRecords, 'total records');
    }

    addEntity() {
        this.addEntityEvent.emit();
    }

    editEntity(rowData: any) {
        this.editEntityEvent.emit(rowData);
    }

    deleteEntity(rowData: any) {
        this.deleteDataEvent.emit(rowData);
    }
    addAccount(){
        this.authService.setViewSession(false)
    }
    viewEntity(rowData: any) {
        this.viewEntityEvent.emit(rowData);
    }

    viewEntityForServiceRequest(rowData: any) {
        this.viewEntityEvent.emit(rowData);
    }

    reassignEntity(rowData: any) {
        this.reassignForServiceRequestEntityEvent.emit(rowData);
    }

    addRepairChecklistEntity(rowData: any) {
        this.addRepairCheckEntityEvent.emit(rowData);
    }

    addProblemDiagnosisEntity(rowData: any) {
        this.addProblemDiagnosisEntityEvent.emit(rowData);
    }

    resheduleEntity(rowData: any) {
        this.resheduleForServiceRequestEntityEvent.emit(rowData);
    }

    orderStatusEntity(rowData: any) {
        this.orderStatusForOrderDetailsEntityEvent.emit(rowData);
    }

    searchEntity() {
        this.searchEntityEvent.emit(this.searchText);
    }

    paginate(event: any) {
        this.paginateEvent.emit(event);
    }

    switchToTable() {}

    changeView(event: any) {
        this.changeViewEvent.emit(event);
        // console.log(event);
    }

    deactiveEntity(rowData) {
        this.deactiveDataEvent.emit(rowData);
    }

    activeEntity(rowData) {
        this.activeDataEvent.emit(rowData);
    }

    activeDeactive(rowData:any,type:string){
        console.log("activeDeactive" +type);
        if(type==="active"){
          rowData.isDeactive="N";
        }else  if(type==="deactive"){
          rowData.isDeactive="Y";
        }
    
    
        this.activeDeactiveEvent.emit(rowData);
      }

    archiveEntity(rowData) {
        this.archiveDataEvent.emit(rowData);
    }

    viewLogsEntity(rowData) {
        this.viewLogsDataEntity.emit(rowData);
    }

    filterEnitity() {
        this.filterEntityEvent.emit();
    }

    downloadEntity(rowData) {
        this.downloadDataEvent.emit(rowData);
    }

    calculateColspan(): number {
        // Calculate the colspan based on the number of columns
        if (this.genericTableSettingInput.action == false) {
            this.columnLength = this.selectedColumns.length;
        } else {
            this.columnLength = this.selectedColumns.length + 1;
        }
        return this.columnLength;
    }

    stringToTime(value: string): Date {
        // Split the time string into hours, minutes, and seconds
        if (!value) {
            return null;
        }
        const [hoursStr, minutesStr, secondsStr] = value
            .split(":")
            .map((part) => parseInt(part, 10));

        // Create a new Date object with today's date and the parsed time
        const date = new Date();
        date.setHours(hoursStr || 0); // If hoursStr is undefined or null, default to 0
        date.setMinutes(minutesStr || 0); // If minutesStr is undefined or null, default to 0
        date.setSeconds(secondsStr || 0); // If secondsStr is undefined or null, default to 0

        return date;
    }

    exportCSV() {
        this.exportEntityEvent.emit();
    }

    showImageModal(src) {
        this.src = src;
        this.isImageModalVisible = true;
        console.log("modal");
    }

    hideImageModal() {
        this.isImageModalVisible = false;
    }
    saveRowData(rowData: any) {
        // console.log('adas');
        this.rowDataEdit.emit(rowData);
    }
    saveRowDataUnload(rowData: any) {
        // console.log('adas');
        this.rowDataEditUnload.emit(rowData);
    }

    openViewDetailsModal(rowData: any) {
        this.openEditModal.emit(rowData);
    }

    handleButtonClickToOpenDialogueForForViewCreateOrder(flag: string) {
        this.openAddDialogModuleEvent.emit(true);
    }

    handleButtonClickToOpenDialogueForSparePartRequest() {
        this.openAddDialogModuleEventForSparePartRequest.emit(true);
    }

    handleButtonClickToOpenDialogueForOnDemand() {
        this.openAddDialogModuleEventForOnDemand.emit(true);
    }

    handleButtonClickToOpenDialogueForUpdateStatus(rowData: any) {
        this.openAddDialogModuleEventForUpdateStatus.emit(rowData);
    }
    handleAddReceipt(rowData: any) {
        this.addReceiptEvent.emit(rowData);
    }

    addEvent() {
        this.openAddDialogModuleEvent.emit(true);
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent.emit(false);
    }

    saveEventDialog() {
        this.openAddDialogModuleEvent.emit(false);
    }

    genericTableSettingInputForViewStatus(rowData: any) {
        this.genericTableSettingForViewEvent.emit(rowData);
    }

    // statusForServiceRequest() {
    //     if (this.genericTableSettingInput.viewForServiceRequest === true) {
    //         for (const request of this.genericListInput) {
    //             const status = request["status"];
    //             if (status === "Accepted" || status === "Pending") {
    //                 // Show only view if any request is completed
    //                 request.viewForServiceRequest = true;
    //                 request.reassignForServiceRequest = true;
    //                 request.rescheduleForServiceRequest = true;
    //             } else if (status === "Reject") {
    //                 // Show all: view, reassign, reschedule
    //                 request.viewForServiceRequest = true;
    //                 request.reassignForServiceRequest = true;
    //                 request.rescheduleForServiceRequest = true;
    //             } else if (status === "In Progress") {
    //                 // Show view and reschedule only
    //                 request.viewForServiceRequest = true;
    //                 request.reassignForServiceRequest = false;
    //                 request.rescheduleForServiceRequest = false;
    //             }
    //         }
    //     }
    // }
}
