import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Customer } from "src/app/demo/domain/customer";
import { AuthService } from "src/app/service/auth.service";
import { CustomerService } from "src/app/service/customerservice";
import { PredefinedService } from "src/app/service/predefined.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { CustomerCategory } from "src/app/demo/domain/customer";

import Swal from "sweetalert2";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
declare var require: any;
const FileSaver = require("file-saver");

@Component({
    selector: "app-customer-management",
    templateUrl: "./customer-management.component.html",
    styleUrls: ["./customer-management.component.scss"],
})
export class CustomerManagementComponent implements OnInit {
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    customerTypeList: CustomerCategory[] = [];
    selectedcustomerType: CustomerCategory = {} as CustomerCategory;
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    customerId: string;
    totalRecords: number;
    msg: any;
    fileSave: any;
    dialogWidth = "650px";
    statusList: any[] = [];
    dummyData: any[] = [];
    visibleSidebar: boolean = false;
    customers: Customer[];
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedCustomerContract: PredefinedMaster = {} as PredefinedMaster;
    customer: Customer = {} as Customer;

    constructor(
        private customerService: CustomerService,
        private sweetAlertService: SweetAlertService,
        public authService: AuthService,
        public router: Router,
        private predefinedService: PredefinedService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getCustomerList();
        this.getCustomerManagementCount();
        this.getCustomerCategory();
        this.getCustomerContractStatus("CUSTOMER-CONTRACT-STATUS");
        // this.getStatusList();
    }
    setTableSetting() {
        this.searchPlaceholder = "Account Name";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: true,
            clear: false,
            export: false,
            paginate: true,
            delete: false,
            edit: true,
            view: true,
            active: true,
            deactive: false,
            activeDeactives: false,
            allowExport: true,
            allowExportxl: false,
            addClient: true,
            createOrder: false,
            addCatelog: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
            search: true,
        };

        this.tableColsEvent = [
            // { field: 'id', header: 'ID', fieldType: "text" },
            { field: "index", header: "S.No", fieldType: "index" },
            {
                field: "customer_category",
                header: "Customer Category",
                fieldType: "text",
            },
            {
                field: "account_name",
                header: "Account Name",
                fieldType: "text",
            },
            {
                field: "phone",
                header: "Mobile number",
                fieldType: "text",
            },
            { field: "email", header: "Mail Id", fieldType: "text" },
            {
                field: "status",
                header: "Current Contract Status",
                fieldType: "text",
            },
            {
                field: "statusActive",
                header: "Status",
                fieldType: "text",
            },
        ];
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        this.customer.page = event.page + 1;
        this.customer.page_size = this.pageSize;
        this.getCustomerList();
    }

    addEvent() {
        // this.titleEVent="Add Product";
        // this.product = new ProductMaster();
        // this.openAddDialogModuleEvent=true;
        // this.hideButtonView=true;
    }

    editEvent(customer: Customer) {
        this.router.navigate(["/panel/add-client/" + customer.uuid]);
        this.authService.setViewSession(false);
        // localStorage.setItem("view","false")
    }
    viewEntityEvent(customer: Customer) {
        this.router.navigate(["/panel/add-client/" + customer.uuid]);

        this.authService.setViewSession(true);
    }

    searchData($event) {
        this.customer.search_by = $event;
        this.getCustomerList();
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
        this.customer.customer_category_uuid = this.selectedcustomerType.uuid;
        this.customer.status_uuid = this.selectedCustomerContract.uuid;
        this.getCustomerList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.customer = {} as Customer;
        this.selectedcustomerType = {} as CustomerCategory;
        this.selectedCustomerContract = {} as PredefinedMaster;
        this.getCustomerList();
        this.visibleSidebar = false;
    }

    getCustomerContractStatus(type: string) {
        this.predefinedMasterObject.entity_type = type;
        this.predefinedService
            .getServiceRequestStatus(this.predefinedMasterObject)
            .subscribe((data: any) => {
                switch (type) {
                    case "CUSTOMER-CONTRACT-STATUS":
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

    getCustomerList() {
        this.customerService.getCustomerList(this.customer).subscribe(
            (data) => {
                this.customers = data;

                this.customers = data.map((customer) => ({
                    ...customer,
                    status: customer.status ?? "Pending",
                    statusActive: customer.is_active ? "Active" : "Deactive",
                }));
            },
            (err) => {
                console.log(err, "ERR");

                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    getCustomerCategory() {
        this.customerService
            .getCustomerCategory(this.selectedcustomerType)
            .subscribe(
                (data: any) => {
                    this.customerTypeList = data;
                },
                (err) => {
                    console.log(err, "ERR");

                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    exportCustomers() {
        let customer = JSON.parse(JSON.stringify(this.customer));
        this.customerService.exportCustomers(customer).subscribe(
            (data: any) => {
                const blob = new Blob([data], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob, "customers.xlsx");
            },
            (err) => {
                const blob1 = new Blob([err.error.text], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob1, "customers.xlsx");
            }
        );
    }

    getCustomerManagementCount() {
        this.customerService
            .getCustomerManagementCount(this.customer)
            .subscribe(
                (data: any) => {
                    this.totalRecords = data.count;
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    deleteCustomer(customer: Customer) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.dismiss != null && result.dismiss != undefined) {
                Swal.close();
            } else {
                this.customerService.deleteCustomer(customer.uuid).subscribe(
                    (data) => {
                        Swal.fire(
                            "Deleted!",
                            "Data deleted successfully.",
                            "success"
                        );
                        this.getCustomerList();
                    },
                    (error) => {
                        if (error instanceof HttpErrorResponse) {
                            if (error.status === 200) {
                                Swal.fire(
                                    "Deleted!",
                                    "Data deleted successfully.",
                                    "success"
                                );
                                this.getCustomerList();
                            } else {
                            }
                        }
                    }
                );
            }
        });
    }

    activeDeactiveCustomer(customer: Customer) {
        console.log(customer, "userData");
        let deactiveActiveString: string;
        if (customer.is_active == false) {
            deactiveActiveString = "Activate";
        } else if (customer.is_active == true) {
            deactiveActiveString = "Deactivate";
        }
        Swal.fire({
            title:
                "Are you sure that you want to " + deactiveActiveString + " ?",
            icon: "warning",
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.dismiss != null && result.dismiss != undefined) {
                Swal.close();
            } else {
                // let custeTemp = new Customer();
                // custeTemp.uuid = customer.uuid;
                // if (customer.is_deactivate == "N") {
                //   custeTemp.is_deactivate = "Y";
                // } else if (customer.is_deactivate == "Y") {
                //   custeTemp.is_deactivate = "N";
                // }
                this.customerService
                    .changeStatus(customer.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Customer " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getCustomerList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Customer " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getCustomerList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }
}
