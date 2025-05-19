import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { AddOnDemand, AddSparePart } from "src/app/model/OrderDetails.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { OrderDetails } from "src/app/service/orderDetails.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { Address } from "src/app/demo/domain/customer";
import { CustomerService } from "src/app/service/customerservice";
import { Customer } from "src/app/demo/domain/customer";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { ServiceEngineerList } from "src/app/model/ServiceRequest.model";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { objectValidator } from "../../custom-validator";
@Component({
    selector: "app-add-on-demand",
    templateUrl: "./add-on-demand.component.html",
    styleUrls: ["./add-on-demand.component.scss"],
})
export class AddOnDemandComponent implements OnInit {
    @Output() closeModalEventOnDemand = new EventEmitter<boolean>();
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEventForSparePartRequest: boolean = false;
    openAddDialogModuleEventForOnDemand: boolean = false;
    openAddDialogModuleEventForUpdateStatus: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    subTotalAmount: any;
    discountPercentage: any;
    subPayableAmount: any;
    discountAmount: any;
    subTaxAmount: any;
    taxTotal: any;
    fileSave: any;
    dialogWidth = "650px";
    cityList: any[] = [];
    addOnDemandList: AddOnDemand[] = [];
    addOnDemandObject: AddOnDemand = {} as AddOnDemand;
    visibleSidebar: boolean = false;
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    customerId: string;
    address: Address = {} as Address;
    customer: Customer = {} as Customer;
    customers: Customer[];
    selectedcustomer: Customer = {} as Customer;
    serviceEngineerObject: ServiceEngineerList = {} as ServiceEngineerList;
    selectedServiceEngineer: ServiceEngineerList = {} as ServiceEngineerList;
    serviceEngineerList: ServiceEngineerList[] = [];
    addOnDemandForm: UntypedFormGroup;
    filteredcustomersList: any[] = [];
    filteredServiceList: any[] = [];

    constructor(
        private orderDetails: OrderDetails,
        private sweetAlertService: SweetAlertService,
        private predefinedService: PredefinedService,
        private customerService: CustomerService,
        private serviceRequestService: ServiceRequestService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getPredefinedByType("CITY");
        this.getCustomerList();
        this.getServiceEngineerList();

        this.addOnDemandForm = new UntypedFormGroup({
            addOnDemandObject: new UntypedFormControl("", [objectValidator()]),
            location: new UntypedFormControl("", [objectValidator()]),
            servicePerson: new UntypedFormControl("", [objectValidator()]),
            discount: new UntypedFormControl("", [
                Validators.required,
                Validators.max(100),
                Validators.pattern("^[0-9]*$"),
            ]),
            discount_total: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            tax_total: new UntypedFormControl("", [
                Validators.required,
                Validators.max(1000),
                Validators.pattern("^[0-9]*$"),
            ]),
            total_payable: new UntypedFormControl("", Validators.required),
            subtotal: new UntypedFormControl("", [
                Validators.required,
                Validators.max(100000),
                Validators.pattern("^[0-9]*$"),
            ]),
        });
    }
    setTableSetting() {
        this.tableSettingsEvent = {
            add: false,
            action: true,
            filter: true,
            clear: false,
            export: false,
            paginate: true,
            delete: false,
            edit: false,
            view: false,
            active: true,
            deactive: true,
            activeDeactives: false,
            allowExport: true,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: true,
            addOrderDetailsOnDemand: true,
            updateStatusForOrderDetails: true,
        };
    }

    closeEventDialog() {
        this.closeModalEventOnDemand.emit(false);
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        // this.product.pageNumber = event.page;
        // this.product.pageSize = this.pageSize;
    }

    addEvent() {
        // this.titleEVent="Add Product";
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
    }

    searchData($event) {
        // this.product.searchValue= $event;
        // this.getProductList();
    }

    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    searchFilter() {
        // this.getProductList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.visibleSidebar = false;
    }

    getCustomerList() {
        this.customerService.getCustomerList(this.customer).subscribe(
            (data) => {
                this.customers = data;
            },
            (err) => {
                console.log(err, "ERR");

                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    getPredefinedByType(type: string) {
        let predefined = new PredefinedMaster();
        predefined.entity_type = type;
        this.predefinedService
            .getPredefinedByTypeAndCode(predefined)
            .subscribe((data: any) => {
                switch (type) {
                    case "CITY":
                        this.cityList = data.data;
                        if (this.customerId) {
                            this.predefinedMasterObject = this.cityList.filter(
                                (city: PredefinedMaster) =>
                                    city.name === this.address.city
                            )[0];
                        }
                        break;
                    default:
                        break;
                }
            });
    }

    getServiceEngineerList() {
        this.serviceRequestService
            .getServiceEngineerList(this.serviceEngineerObject)
            .subscribe(
                (data: any) => {
                    this.serviceEngineerList = data;

                    console.log(
                        "service Engineer List",
                        this.serviceEngineerList
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    saveAddOnDemand() {
        this.addOnDemandForm.markAllAsTouched();
        if (!this.addOnDemandForm.valid) {
            return;
        }
        this.addOnDemandForm;

        this.addOnDemandObject.customer_uuid = this.selectedcustomer.uuid;
        this.addOnDemandObject.service_person_uuid =
            this.selectedServiceEngineer.uuid;
        this.orderDetails.saveAddOnDemand(this.addOnDemandObject).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.closeEventDialog();
            },
            (err) => {
                this.sweetAlertService.errorAlert("Something Went Wrong");
            }
        );
    }

    subTotalDiscountAmount() {
        if (isNaN(Number(this.addOnDemandObject.discount_total))) {
            this.addOnDemandObject.discount_total = "";
        } else {
            this.addOnDemandObject.discount_total = "";
            this.subTotalAmount = this.addOnDemandObject.subtotal;
            this.discountPercentage = this.addOnDemandObject.discount;

            this.discountAmount =
                this.subTotalAmount * (this.discountPercentage / 100);

            this.addOnDemandObject.discount_total = this.discountAmount;

            this.subPayableAmount = this.subTotalAmount - this.discountAmount;
        }
    }

    subTaxDiscountAmount() {
        if (isNaN(Number(this.addOnDemandObject.total_payable))) {
            this.addOnDemandObject.total_payable = "";
        } else {
            this.taxTotal = this.addOnDemandObject.tax_total;

            this.subTaxAmount = this.subPayableAmount + Number(this.taxTotal);

            this.addOnDemandObject.total_payable = this.subTaxAmount;
        }
    }

    searchParent(event) {
        this.customer.search_by = event.query;
        this.getCustomerList();
    }

    searchServiceEngineer(event) {
        this.serviceEngineerObject.search_by = event.query;
        this.getServiceEngineerList();
    }
}
