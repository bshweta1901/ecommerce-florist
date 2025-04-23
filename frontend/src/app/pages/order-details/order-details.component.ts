import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
    OrderDetailsMaster,
    UpdateCustomerInvoice,
} from "src/app/model/OrderDetails.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { AuthService } from "src/app/service/auth.service";
import { OrderDetails } from "src/app/service/orderDetails.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { objectValidator } from "../custom-validator";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { ReceiptMaster } from "src/app/model/receipt.model";
declare var require: any;
const FileSaver = require("file-saver");

@Component({
    selector: "app-order-details",
    templateUrl: "./order-details.component.html",
    styleUrls: ["./order-details.component.scss"],
})
export class OrderDetailsComponent implements OnInit {
    tableColsEvent: any[] = [];
    receiptColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    receiptTableSettingEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEventForSparePartRequest: boolean = false;
    openAddDialogModuleEventForOnDemand: boolean = false;
    openAddDialogModuleEventForUpdateStatus: boolean = false;
    editReceiptDialogue: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;
    dialogWidth = "400px";
    dialogWidthForRecepit = "650px";
    statusList: any[] = [];
    balanceAmount: number;

    oredrDetailsCount: OrderDetailsMaster[] = [];
    oredrDetailsList: OrderDetailsMaster[] = [];
    oredrDetailsObject: OrderDetailsMaster = {} as OrderDetailsMaster;
    selectedDetailsStatus: OrderDetailsMaster = {} as OrderDetailsMaster;
    selectedDetailsService: { label: string; value: string } = {
        label: "",
        value: "",
    };
    customerId: string;
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedStatusObject: PredefinedMaster = {} as PredefinedMaster;
    selectedDetailsDate: OrderDetailsMaster = {} as OrderDetailsMaster;
    selectedModeOfPayment: PredefinedMaster = {} as PredefinedMaster;
    paymentList: any[] = [];
    receiptStatusList: any[] = [];

    visibleSidebar: boolean = false;

    updateStatusForm: FormGroup;
    selectedUpdateStatus: UpdateCustomerInvoice = {} as UpdateCustomerInvoice;
    updateStatusObject: ReceiptMaster = {} as ReceiptMaster;
    receiptList: ReceiptMaster[] = [];
    receiptMaster: ReceiptMaster = new ReceiptMaster();

    @Output() addDialogModuleEvent = new EventEmitter<boolean>();
    @Output() addDialogModuleEventOnDemand = new EventEmitter<boolean>();
    @Output() addDialogModuleEventOnUpdate = new EventEmitter<boolean>();
    @Output() addUuidEventOnUpdate = new EventEmitter<string>();
    constructor(
        public authService: AuthService,
        private orderDetails: OrderDetails,
        public router: Router,
        private predefinedService: PredefinedService,
        private sweetAlertService: SweetAlertService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getOrderDetailsList();
        this.getOrderDetailsCount();
        this.getOrderDetailStatus("CUSTOMER-INVOICE-STATUS");
        this.getPredefinedByType("CUSTOMER-INVOICE-STATUS");
        this.getPredefinedByType("MODE-OF-PAYMENT");
        this.getPredefinedByType("RECEIPT-STATUS");
        this.getorderDetailsMode();
        this.updateStatusForm = new FormGroup({
            selectedUpdateStatus: new FormControl({} as PredefinedMaster, [
                objectValidator(),
            ]),
            selectedModeOfPayment: new FormControl({} as PredefinedMaster, [
                objectValidator(),
            ]),
            transaction_details: new FormControl("", Validators.required),
            amount: new FormControl("", Validators.required),
            remarks: new FormControl(""),
            payment_date: new FormControl(""),
        });
    }
    setTableSetting() {
        this.searchPlaceholder = "Order Details";
        this.tableSettingsEvent = {
            tableFilter: true,
            add: false,
            action: true,
            filter: true,
            clear: false,
            export: false,
            paginate: true,
            delete: false,
            edit: false,
            view: false,
            active: false,
            deactive: false,
            activeDeactives: false,
            allowExport: true,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            updateStatusForOrderDetails: true,
            addReceipt: true,
            search: true,
        };
        this.receiptTableSettingEvent = {
            tableFilter: false,
            add: false,
            action: false,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: false,
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
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            updateStatusForOrderDetails: false,
            addReceipt: false,
        };
        this.tableColsEvent = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "customer_invoice_id",
                header: "Invoice No",
                fieldType: "text",
            },
            {
                field: "invoice_date",
                header: "Invoice Date",
                fieldType: "date",
            },
            {
                field: "account_name",
                header: "Account Name",
                fieldType: "text",
            },
            {
                field: "package",
                header: "Package",
                fieldType: "text",
            },
            {
                field: "total_payable",
                header: "Payable Amount",
                fieldType: "text",
            },
            {
                field: "customer_contract_id",
                header: "Contract No",
                fieldType: "text",
            },
            {
                field: "invoice_status",
                header: "Invoice Status",
                fieldType: "text",
            },
        ];
        this.receiptColsEvent = [
            // {
            //     field: "uuid",
            //     header: "Receipt Id",
            //     fieldType: "text",
            // },

            {
                field: "payment_date",
                header: "Payment Date",
                fieldType: "date",
            },
            {
                field: "mode_of_payment",
                header: "Payable Amount",
                fieldType: "text",
            },
            {
                field: "amount",
                header: "Contract No",
                fieldType: "text",
            },
            {
                field: "receipt_status",
                subfield: "name",
                header: "Invoice Status",
                fieldType: "nestedData",
            },
        ];
    }

    openDialog() {
        const openAddDialogModuleEventForSparePartRequest = false;

        this.addDialogModuleEvent.emit(
            openAddDialogModuleEventForSparePartRequest
        );
    }

    openDialogOnDemand() {
        const openAddDialogModuleEventForOnDemand = false;
        this.addDialogModuleEventOnDemand.emit(
            openAddDialogModuleEventForOnDemand
        );
    }

    openDialogOnUpdate() {
        const openAddDialogModuleEventForUpdateStatus = false;
        this.addDialogModuleEventOnUpdate.emit(
            openAddDialogModuleEventForUpdateStatus
        );
    }

    closeEventDialog() {
        this.openAddDialogModuleEventForSparePartRequest = false;
        this.openAddDialogModuleEventForOnDemand = false;
        this.openAddDialogModuleEventForUpdateStatus = false;
        this.editReceiptDialogue = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        this.oredrDetailsObject.page = event.page + 1;
        this.oredrDetailsObject.per_page = this.pageSize;
        this.getOrderDetailsList();
    }

    addEvent() {
        // this.titleEVent="Add Product";
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
    }

    searchData($event) {
        this.oredrDetailsObject.search_by = $event;
        this.getOrderDetailsList();
    }

    deleteEvent(event) {}

    activeEntity($event) {}
    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    deactiveEntity($event) {}

    saveEventDialog() {
        this.openAddDialogModuleEventForSparePartRequest = false;
        this.openAddDialogModuleEventForOnDemand = false;
        this.openAddDialogModuleEventForUpdateStatus = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    searchFilter() {
        this.oredrDetailsObject.invoice_status_uuid =
            this.selectedStatusObject.uuid;
        this.oredrDetailsObject.package = this.selectedDetailsDate.uuid;
        this.getOrderDetailsList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.oredrDetailsObject = {} as OrderDetailsMaster;
        this.selectedDetailsDate = {} as OrderDetailsMaster;
        this.selectedStatusObject = {} as PredefinedMaster;
        this.selectedDetailsService = { label: "", value: "" };
        this.getOrderDetailsList();
        this.visibleSidebar = false;
    }

    handleButtonClickToOpenDialogueForSparePartRequest() {
        this.openAddDialogModuleEventForSparePartRequest = true;
    }

    handleButtonClickToOpenDialogueForOnDemand() {
        this.openAddDialogModuleEventForOnDemand = true;
    }

    handleButtonClickToOpenDialogueForUpdateStatus(
        orderDetails: OrderDetailsMaster
    ) {
        this.oredrDetailsObject = orderDetails;
        this.openAddDialogModuleEventForUpdateStatus = true;
    }

    handleAddReceipt(orderDetails: OrderDetailsMaster) {
        this.oredrDetailsObject = orderDetails;

        this.receiptMaster.customer_invoice_uuid = orderDetails.uuid;
        this.balanceAmount = orderDetails.total_payable;
        this.editReceiptDialogue = true;
        this.getReceiptList();
    }

    packageTypeList = [
        { label: "Contract", value: "Contract" },
        { label: "Spare part", value: "Spare part" },
        { label: "On demand", value: "On demand" },
    ];

    onStartDateChange(event: any): void {
        if (event) {
            this.oredrDetailsObject.start_date = this.formatDate(event);
        }
    }

    onEndDateChange(event: any): void {
        if (event) {
            this.oredrDetailsObject.end_date = this.formatDate(event);
        }
    }

    onPaymentDateChange(event: any): void {
        if (event) {
            this.receiptMaster.payment_date = this.formatDate(event);
        }
    }

    formatDate(date: Date): string {
        if (!date) return "";
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    exportOrderDetails() {
        this.orderDetails.exportOrderDetails(this.oredrDetailsObject).subscribe(
            (data: any) => {
                const blob = new Blob([data], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob, "Order Details.xlsx");
            },
            (err) => {
                const blob1 = new Blob([err.error.text], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob1, "Order Details.xlsx");
            }
        );
    }

    getOrderDetailsList() {
        if (this.selectedDetailsService.value === "Contract") {
            this.oredrDetailsObject.package_type = 1;
        } else if (this.selectedDetailsService.value === "Spare part") {
            this.oredrDetailsObject.package_type = 2;
        } else if (this.selectedDetailsService.value === "On demand") {
            this.oredrDetailsObject.package_type = 3;
        }

        let stringTemp = localStorage.getItem("pending_spare_part_stats");
        if (stringTemp != null && stringTemp != undefined) {
            this.oredrDetailsObject.pending_spare_part_stats = true;
        }
        this.oredrDetailsObject.start_date;
        this.oredrDetailsObject.end_date;
        this.orderDetails
            .getOrderDetailsList(this.oredrDetailsObject)
            .subscribe(
                (data: any) => {
                    this.oredrDetailsList = data;

                    console.log("Oredr Details List", this.oredrDetailsList);
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getOrderDetailsCount() {
        this.orderDetails
            .getOrderDetailsCount(this.oredrDetailsObject)
            .subscribe(
                (data: any) => {
                    this.totalRecords = data.count;

                    console.log("Oredr Details List", this.oredrDetailsList);
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getOrderDetailStatus(type: string) {
        this.predefinedMasterObject.entity_type = type;
        this.predefinedService
            .getServiceRequestStatus(this.predefinedMasterObject)
            .subscribe((data: any) => {
                switch (type) {
                    case "CUSTOMER-INVOICE-STATUS":
                        this.statusList = data.data;
                        if (this.customerId) {
                            this.predefinedMasterObject =
                                this.statusList.filter(
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

        this.updateStatusObject.mode_of_payment =
            this.selectedModeOfPayment.uuid;
        const fd = new FormData();
        fd.append("data", JSON.stringify(this.updateStatusObject));
        this.orderDetails
            .saveUpdateStatus(fd, this.oredrDetailsObject.uuid)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );
                    this.closeEventDialog();
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong");
                }
            );
    }

    getReceiptList() {
        this.orderDetails
            .getReceiptList(this.receiptMaster)
            .subscribe((data: any) => {
                this.receiptList = data;
                let receiptSum = 0;
                this.receiptList.forEach((receipt: ReceiptMaster) => {
                    receiptSum =
                        receipt?.receipt_status?.code === "PAID"
                            ? receiptSum + receipt.amount
                            : receiptSum + 0;
                });
                this.balanceAmount = this.balanceAmount - receiptSum;
            });
    }

    saveReceipt() {
        if (this.balanceAmount < this.receiptMaster.amount) {
            this.sweetAlertService.errorAlert(
                "Entered Amount is greater than the balance amount!"
            );
            this.editReceiptDialogue = false;
            return;
        }
        this.receiptMaster.mode_of_payment = this.selectedModeOfPayment.name;
        this.receiptMaster.amount = +this.receiptMaster.amount;
        this.receiptMaster.payment_date = this.formatDate(
            new Date(this.receiptMaster.payment_date)
        );
        this.receiptMaster.customer_invoice_uuid = this.oredrDetailsObject.uuid;
        this.receiptMaster.receipt_status_uuid = this.receiptStatusList.filter(
            (status: PredefinedMaster) => status.code == "PAID"
        )[0].uuid;

        this.orderDetails
            .saveReceipt(this.receiptMaster)
            .subscribe((data: any) => {
                this.sweetAlertService.successAlert("Receipt Added!");
                this.editReceiptDialogue = false;
                this.getOrderDetailsList();
            });
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
                    case "RECEIPT-STATUS":
                        this.receiptStatusList = data.data;
                        this.getorderDetailsMode();
                        // if (this.customerId) {
                        //     this.predefinedMasterObject =
                        //         this.paymentList.filter(
                        //             (status: PredefinedMaster) =>
                        //                 status.name ===
                        //                 this.predefinedMasterObject.name
                        //         )[0];
                        // }
                        break;
                    default:
                        break;
                }
            });
    }

    getorderDetailsMode() {
        this.selectedUpdateStatus = this.statusList.find(
            (item) => this.oredrDetailsObject.invoice_status === item.name
        );
        this.selectedModeOfPayment = this.paymentList.find(
            (item) => this.oredrDetailsObject.mode_of_payment === item.uuid
        );

        this.updateStatusObject.transaction_details =
            this.oredrDetailsObject.transaction_details;

        this.updateStatusObject.remarks = this.oredrDetailsObject.remarks;
    }
}
