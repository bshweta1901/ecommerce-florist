import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Address } from "src/app/demo/domain/customer";
import {
    OrderDetailsMaster,
    UpdateCustomerInvoice,
} from "src/app/model/OrderDetails.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { SparePartManager } from "src/app/model/SparePartMaster.model";
import { OrderDetails } from "src/app/service/orderDetails.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { objectValidator } from "../../custom-validator";

@Component({
    selector: "app-update-status-order",
    templateUrl: "./update-status-order.component.html",
    styleUrls: ["./update-status-order.component.scss"],
})
export class UpdateStatusOrderComponent implements OnInit {
    @Output() closeModalEventOnUpdate = new EventEmitter<boolean>();
    @Input() orderId: string;
    @Input() orderDetailsMode: OrderDetailsMaster;
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;
    dialogWidth = "650px";
    statusList: any[] = [];
    paymentList: any[] = [];
    dummyData: any[] = [];
    products: any[] = [];
    visibleSidebar: boolean = false;
    locationList: PredefinedMaster[] = [];
    address: Address = {} as Address;
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedModeOfPayment: PredefinedMaster = {} as PredefinedMaster;
    id: string;
    updateStatusForm: FormGroup;
    customerId: string;
    updateStatusObject: UpdateCustomerInvoice = {} as UpdateCustomerInvoice;
    selectedUpdateStatus: UpdateCustomerInvoice = {} as UpdateCustomerInvoice;
    updateStatusList: UpdateCustomerInvoice[] = [];

    constructor(
        private sweetAlertService: SweetAlertService,
        private serviceRequestService: ServiceRequestService,
        private predefinedService: PredefinedService,
        private orderDetails: OrderDetails,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getPredefinedByType("CUSTOMER-INVOICE-STATUS");
        this.getPredefinedByType("MODE-OF-PAYMENT");
        this.getorderDetailsMode();

        this.updateStatusForm = new FormGroup({
            selectedUpdateStatus: new FormControl({} as PredefinedMaster, [
                objectValidator(),
            ]),
            // selectedModeOfPayment: new FormControl({} as PredefinedMaster, [
            //     objectValidator(),
            // ]),
            // transaction_details: new FormControl("", Validators.required),
            // no_of_receipt: new FormControl("", [
            //     Validators.required,
            //     Validators.pattern("^[0-9]*$"),
            // ]),
            remarks: new FormControl(""),
        });
    }
    setTableSetting() {
        this.searchPlaceholder = "product name";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: false,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: false,
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
    }

    closeEventDialog() {
        this.closeModalEventOnUpdate.emit(false);
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        // this.product.pageNumber = event.page;
        // this.product.pageSize = this.pageSize;
    }

    addEvent() {
        // this.titleEVent="Add Product";
        // this.product = new ProductMaster();
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
        // this.product = $event;
    }

    searchData($event) {
        // this.product.searchValue= $event;
        // this.getProductList();
    }

    deleteEvent(event) {}

    activeEntity($event) {}

    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    deactiveEntity($event) {}

    saveEventDialog() {
        this.openAddDialogModuleEvent = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    searchFilter() {
        // this.getProductList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.visibleSidebar = false;
    }

    getorderDetailsMode() {
        this.selectedUpdateStatus = this.statusList.find(
            (item) => this.orderDetailsMode.invoice_status === item.name
        );
        this.selectedModeOfPayment = this.paymentList.find(
            (item) => this.orderDetailsMode.mode_of_payment === item.uuid
        );

        // this.updateStatusObject.transaction_details =
        //     this.orderDetailsMode.transaction_details;

        this.updateStatusObject.remarks = this.orderDetailsMode.remarks;
    }

    getPredefinedByType(type: string) {
        let predefined = new PredefinedMaster();
        predefined.entity_type = type;
        this.predefinedService
            .getPredefinedByTypeAndCode(predefined)
            .subscribe((data: any) => {
                switch (type) {
                    case "CUSTOMER-INVOICE-STATUS":
                        this.statusList = data.data;
                        this.getorderDetailsMode();
                        if (this.customerId) {
                            this.predefinedMasterObject =
                                this.statusList.filter(
                                    (status: PredefinedMaster) =>
                                        status.name ===
                                        this.predefinedMasterObject.name
                                )[0];
                        }
                        break;
                    case "MODE-OF-PAYMENT":
                        this.paymentList = data.data;
                        this.getorderDetailsMode();
                        if (this.customerId) {
                            this.predefinedMasterObject =
                                this.paymentList.filter(
                                    (status: PredefinedMaster) =>
                                        status.name ===
                                        this.predefinedMasterObject.name
                                )[0];
                        }
                        break;
                    default:
                        break;
                }
            });
    }

    saveUpdateStatus() {
        this.updateStatusForm.markAllAsTouched();
        if (!this.updateStatusForm.valid) {
            return;
        }
        // const noOfReceipt = Number(this.updateStatusObject.no_of_receipt);
        // noOfReceipt.toString();
        // this.updateStatusObject.no_of_receipt = noOfReceipt;

        this.updateStatusObject.invoice_status_uuid =
            this.selectedUpdateStatus.uuid;

        // this.updateStatusObject.mode_of_payment =
        //     this.selectedModeOfPayment.uuid;
        const fd = new FormData();
        fd.append("data", JSON.stringify(this.updateStatusObject));
        this.orderDetails.saveUpdateStatus(fd, this.orderId).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.closeEventDialog();
            },
            (err) => {
                this.sweetAlertService.errorAlert("Something Went Wrong");
            }
        );
    }
}
