import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { AddSparePart } from "src/app/model/OrderDetails.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { SparePartManager } from "src/app/model/SparePartMaster.model";
import { AuthService } from "src/app/service/auth.service";
import { OrderDetails } from "src/app/service/orderDetails.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { Address } from "src/app/demo/domain/customer";
import { ServiceRequestMaster } from "src/app/model/ServiceRequest.model";
import { objectValidator } from "../../custom-validator";

@Component({
    selector: "app-add-spare-part-request",
    templateUrl: "./add-spare-part-request.component.html",
    styleUrls: ["./add-spare-part-request.component.scss"],
})
export class AddSparePartRequestComponent implements OnInit {
    @Output() closeModalEvent = new EventEmitter<boolean>();
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
    sellingPrice: any;
    taxPrice: any;
    taxTotalAmount: any;
    taxPercentage: any;
    subTotalDiscount: any;
    totalPayableAmount: any;
    msg: any;
    fileSave: any;
    dialogWidth = "650px";
    statusList: any[] = [];
    dummyData: any[] = [];
    products: any[] = [];
    visibleSidebar: boolean = false;
    addSparePartList: AddSparePart[] = [];
    addSparePartObject: AddSparePart = {} as AddSparePart;
    sparePartManagerObject: SparePartManager = {} as SparePartManager;
    sparePartManagerList: SparePartManager[] = [];
    locationList: PredefinedMaster[] = [];
    address: Address = {} as Address;
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    customerId: string;
    selectedSparePart: AddSparePart = {} as AddSparePart;
    selectedSparePartList: AddSparePart[] = [];
    SparePartList: AddSparePart[] = [];
    productList: string[] = [];
    addProducts: any[] = [];
    addSparePartForm: UntypedFormGroup;
    serviceRequestList: ServiceRequestMaster[] = [];
    selectedServiceRequest: ServiceRequestMaster = {} as ServiceRequestMaster;
    serviceRequestObject: ServiceRequestMaster = {} as ServiceRequestMaster;
    filteredSparePartList: any[] = [];

    constructor(
        public authService: AuthService,
        private orderDetails: OrderDetails,
        private sweetAlertService: SweetAlertService,
        private serviceRequestService: ServiceRequestService,
        private predefinedService: PredefinedService
    ) {
        this.initializeSparePartData();
    }

    ngOnInit(): void {
        this.setTableSetting();
        this.getSparePartManagerList();
        this.getServiceRequest();

        this.addSparePartForm = new UntypedFormGroup({
            serviceRequest: new UntypedFormControl("", [objectValidator()]),
            selectedSparePart: new UntypedFormControl("", [objectValidator()]),
            subtotal: new UntypedFormControl("", Validators.required),
            discount_total: new UntypedFormControl("", [
                Validators.required,
                Validators.max(100),
                Validators.pattern("^[0-9]*$"),
            ]),
            tax_total: new UntypedFormControl("", Validators.required),
            total_payable: new UntypedFormControl("", Validators.required),
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
        this.tableColsEvent = [
            {
                field: "spare_part_type_name",
                header: "Spare Part",
                fieldType: "text",
            },
            {
                field: "sku",
                header: "SKU",
                fieldType: "text",
            },
            {
                field: "standard_price",
                header: "Price",
                fieldType: "text",
            },
            {
                field: "tax",
                header: "Tax",
                fieldType: "text",
            },
        ];
    }

    closeEventDialog() {
        this.closeModalEvent.emit(false);
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        // this.product.pageNumber = event.page;
        // this.product.pageSize = this.pageSize;

        // this.auth.setFilterSessionData("Filter",this.product);
        // this.getProductList();
    }

    addEvent() {
        // this.titleEVent="Add Product";
        // this.product = new ProductMaster();
        // this.openAddDialogModuleEvent=true;
        // this.hideButtonView=true;
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
        // this.product = $event;
        // this.productService.setProductSession(this.product);
        // this.getProductById(this.product);
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
        // this.product = new ProductMaster();
        // this.getProductList();
        this.visibleSidebar = false;
    }

    getServiceRequest() {
        this.serviceRequestService
            .getServiceRequest(this.serviceRequestObject)
            .subscribe(
                (data: any) => {
                    this.serviceRequestList = data;
                    console.log("service request dropdown", data);
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getSparePartManagerList() {
        this.serviceRequestService
            .getSparePartManagerList(this.sparePartManagerObject)
            .subscribe(
                (data: any) => {
                    this.sparePartManagerList = data;
                    this.initializeSparePartData();

                    console.log(
                        "service Engineer List",
                        this.sparePartManagerList
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    saveAddSparePart() {
        this.addSparePartForm.markAllAsTouched();
        if (!this.addSparePartForm.valid) {
            return;
        }
        this.addSparePartForm;
        this.addSparePartObject.service_request_uuid =
            this.selectedServiceRequest.uuid;
        this.addSparePartObject.spare_part_uuids = [];
        this.addSparePartObject.spare_part_uuids.push(
            this.selectedSparePart?.uuid
        );
        const fd = new FormData();
        fd.append("data", JSON.stringify(this.addSparePartObject));
        this.orderDetails.saveAddSparePart(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.closeEventDialog();
            },
            (err) => {
                this.sweetAlertService.errorAlert("Something Went Wrong");
            }
        );
    }

    initializeSparePartData(): void {
        if (this.selectedSparePart) {
            this.addProducts = this.sparePartManagerList
                .filter(
                    (sparePart: any) =>
                        sparePart.spare_part_name ===
                        this.selectedSparePart.spare_part_name
                )
                .map((sparePart: any) => {
                    this.sellingPrice = sparePart.selling_price || "";
                    this.taxPrice = sparePart.tax || "";

                    return {
                        spare_part_type_name:
                            sparePart.spare_part_type_name || "",
                        sku: sparePart.sku || "",
                        selling_price: this.sellingPrice,
                        tax: this.taxPrice || "",
                    };
                });
            this.addSparePartObject.subtotal = this.sellingPrice;
            // this.addSparePartObject.tax_total = this.taxPrice;
        }
    }

    subTotalDiscountAmount() {
        if (isNaN(Number(this.addSparePartObject.tax_total))) {
            this.addSparePartObject.tax_total = "";
        } else {
            this.subTotalDiscount = this.addSparePartObject.discount_total;

            this.taxTotalAmount =
                this.sellingPrice * (this.subTotalDiscount / 100);

            this.totalPayableAmount = this.sellingPrice - this.taxTotalAmount;

            this.taxPercentage =
                this.totalPayableAmount * (this.taxPrice / 100);

            this.addSparePartObject.tax_total = this.taxPercentage;

            this.addSparePartObject.total_payable =
                this.totalPayableAmount + this.taxPercentage;
        }
    }

    onSparePartSelect() {
        this.initializeSparePartData();
    }

    addNewSparePartRequest() {
        this.addSparePartObject.spare_part_uuids = [];
        this.addSparePartObject.spare_part_uuids.push(
            this.selectedSparePart.spare_part_name
        );
    }

    searchParent(event) {
        this.sparePartManagerObject.search_by = event.query;
        this.getSparePartManagerList();
    }

    searchServiceRequests(event) {
        this.serviceRequestObject.search_by = event.query;
        this.getServiceRequest();
    }
}
