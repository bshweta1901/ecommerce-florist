import { Component, Input, OnInit } from "@angular/core";
import { OrderDetailsMaster } from "src/app/model/OrderDetails.model";
import {
    ServiceRequestList,
    ServiceRequestMaster,
    SlotMaster,
    SopDetail,
    SparePart,
} from "src/app/model/ServiceRequest.model";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";

@Component({
    selector: "app-service-spare-part",
    templateUrl: "./service-spare-part.component.html",
    styleUrls: ["./service-spare-part.component.scss"],
})
export class ServiceSparePartComponent implements OnInit {
    // @Input() spareList: SparePart[] = [];
    tableSettingsEvent: any = {};
    tableColsEventSparePart: any[] = [];
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    showDialogueBoxForSparePart: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;
    dialogWidth = "650px";
    customerId: string;
    posList: SopDetail[] = [];
    sopList: SopDetail[] = [];
    visibleSidebar: boolean = false;
    spareList: OrderDetailsMaster[] = [];
    sparePartObject: OrderDetailsMaster = {} as OrderDetailsMaster;
    updateSparePartObj: SparePart = {} as SparePart;
    sparePartUuid: string;

    constructor(
        private serviceRequestService: ServiceRequestService,
        private sweetAlertService: SweetAlertService
    ) {}

    ngOnInit(): void {
        this.getServiceRequestList();
        this.setTableSetting();
    }

    setTableSetting() {
        this.searchPlaceholder = "Service Spare Part";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: true,
            search: false,
            view: false,
            active: false,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };
        this.tableColsEventSparePart = [
            {
                field: "account_name",
                header: "Account Name",
                fieldType: "text",
            },
            {
                field: "invoice_date",
                header: "Invoice Date",
                fieldType: "date",
            },
            {
                field: "spare_part_name",
                header: "Spare Part Name",
                fieldType: "text",
            },
            {
                field: "invoice_status",
                header: "Status",
                fieldType: "text",
            },
            {
                field: "subtotal",
                header: "Price",
                fieldType: "text",
            },
            {
                field: "tax_total",
                header: "Tax",
                fieldType: "text",
            },
            {
                field: "discount_total",
                header: "Discount",
                fieldType: "text",
            },
            {
                field: "total_payable",
                header: "Total Price",
                fieldType: "text",
            },
        ];
    }

    closeEventDialog() {
        this.showDialogueBoxForSparePart = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
    }

    searchData($event) {
        // this.serviceEngineerObject.search_by = $event;
        // this.getServiceEngineerList();
    }

    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    saveEventDialog() {
        this.openAddDialogModuleEvent = false;
    }

    searchFilter() {
        this.visibleSidebar = false;
    }
    resetFilter() {
        // this.serviceEngineerObject = {} as ServiceEngineerList;
        // this.getServiceEngineerList();
        this.visibleSidebar = false;
    }

    getServiceRequestList() {
        this.sparePartObject.invoice_for_id = 2;
        this.sparePartObject.service_request = true;
        this.serviceRequestService
            .getServiceSparePartList(this.sparePartObject)
            .subscribe(
                (data: any) => {
                    this.spareList = data;
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    openDialogueBoxForSparePart(sparePart: ServiceRequestList) {
        this.sparePartUuid = sparePart.customer_spare_part_uuid;
        this.showDialogueBoxForSparePart = true;
    }

    updateSpareParts() {
        if (this.updateSparePartObj.is_old_status.includes("Received")) {
            this.updateSparePartObj.is_old_received = true;
        }

        this.updateSparePartObj.is_old_status = undefined;
        const fd = new FormData();
        fd.append("data", JSON.stringify(this.updateSparePartObj));
        this.serviceRequestService
            .updateSparePartStatus(fd, this.sparePartUuid)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.getServiceRequestList();
                    this.showDialogueBoxForSparePart = false;
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }
}
