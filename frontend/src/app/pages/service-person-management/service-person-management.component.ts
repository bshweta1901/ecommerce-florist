import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
    ServiceEngineerList,
    ServiceEngineerMaster,
} from "src/app/model/ServiceRequest.model";
import { AuthService } from "src/app/service/auth.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { PredefinedService } from "src/app/service/predefined.service";
import { User } from "src/app/model/User.model";
import { ProductService } from "src/app/service/product.service";
import { ProductCategory } from "src/app/model/Product";
declare var require: any;
const FileSaver = require("file-saver");

@Component({
    selector: "app-service-person-management",
    templateUrl: "./service-person-management.component.html",
    styleUrls: ["./service-person-management.component.scss"],
})
export class ServicePersonManagementComponent implements OnInit {
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
    // statusList: any[] = [];
    customerId: string;
    visibleSidebar: boolean = false;
    serviceEngineerObject: ServiceEngineerList = {} as ServiceEngineerList;
    serviceEngineerList: ServiceEngineerList[] = [];
    selectedServiceEngineer: ServiceEngineerList[] = [];
    serviceEngineerCount: ServiceEngineerList[] = [];
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedStatus: ServiceEngineerList = {} as ServiceEngineerList;
    serviceEngineerDropdownList: any[] = [];
    managerList: User[] = [];
    productCategoryDropdownList: ProductCategory[] = [];
    selectedProductCategory: ProductCategory = {} as ProductCategory;
    constructor(
        public authService: AuthService,
        private serviceRequestService: ServiceRequestService,
        public router: Router,
        private productService: ProductService,
        private predefinedService: PredefinedService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getServiceEngineerList();
        // this.getServiceRequestStatus("SERVICE-REQUEST-STATUS");
        this.getServiceEngineerCount();
        this.getServiceEngineerDropdown();
        this.getProductCategoryList();
    }
    setTableSetting() {
        this.searchPlaceholder = "Service Engineer";
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
            addClient: false,
            createOrder: false,
            addCatelog: false,
            addSparePart: false,
            addServicePerson: true,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
            search: true,
        };
        this.tableColsEvent = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "first_name",
                header: "Name",
                fieldType: "text",
            },
            {
                field: "product_category",
                header: "Product Category",
                fieldType: "text",
            },
            {
                field: "city",
                header: "City",
                fieldType: "text",
            },
            {
                field: "phone",
                header: "Mobile number",
                fieldType: "text",
            },
            {
                field: "email",
                header: "Mail ID",
                fieldType: "text",
            },
            {
                field: "status",
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
        this.serviceEngineerObject.page = event.page + 1;
        this.serviceEngineerObject.per_page = this.pageSize;
        this.getServiceEngineerList();
    }

    searchData($event) {
        this.serviceEngineerObject.search_by = $event;
        this.getServiceEngineerList();
    }

    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    saveEventDialog() {
        this.openAddDialogModuleEvent = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    activeEntity($event) {}

    deactiveEntity($event) {}

    searchFilter() {
        this.serviceEngineerObject.location = this.selectedStatus?.city;
        this.serviceEngineerObject.product_category_uuid =
            this.selectedProductCategory?.uuid;
        this.getServiceEngineerList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.serviceEngineerObject = {} as ServiceEngineerList;
        this.selectedStatus.city = "";
        this.selectedProductCategory = {} as ProductCategory;
        this.getServiceEngineerList();
        this.getServiceEngineerDropdown();
        this.visibleSidebar = false;
    }

    navigateToSparePart(service: ServiceEngineerList, action: "edit" | "view") {
        const url = `/panel/add-service-person-management/${service.uuid}`;

        const navigationExtras = {
            queryParams: { action },
        };

        this.router.navigate([url], navigationExtras);
    }

    editEvent(sparePartId: ServiceEngineerList) {
        this.navigateToSparePart(sparePartId, "edit");
    }

    viewEntity(sparePartId: ServiceEngineerList) {
        this.navigateToSparePart(sparePartId, "view");
    }

    getServiceEngineerList() {
        let stringTemp = localStorage.getItem("unavailable_engineer_stats");
        if (stringTemp != null && stringTemp != undefined) {
            this.serviceEngineerObject.unavailable_engineer_stats = true;
        }

        this.serviceRequestService
            .getServiceEngineerList(this.serviceEngineerObject)
            .subscribe(
                (data: any) => {
                    this.serviceEngineerList = data;
                    data.forEach((engineer) => {
                        engineer.status =
                            engineer.is_active === true ? "Active" : "Deactive";
                    });
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getServiceEngineerDropdown() {
        this.serviceRequestService
            .getServiceEngineerList(this.serviceEngineerObject)
            .subscribe(
                (data: any) => {
                    // this.serviceEngineerList = data;
                    this.serviceEngineerDropdownList = data;

                    this.serviceEngineerDropdownList = Array.from(
                        new Set(data.map((engineer: any) => engineer.city))
                    ).map((city: string) => ({
                        city: city,
                    }));
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    deleteServiceEngineer(event) {
        Swal.fire({
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
                let delCustomer = this.serviceEngineerObject;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.serviceRequestService
                    .deleteServiceEngineer(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Service Engineer successfully.",
                                "success"
                            );
                            this.getServiceEngineerList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Service Engineer successfully.",
                                        "success"
                                    );
                                    this.getServiceEngineerList();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    exportServiceEngineerList() {
        let customer = JSON.parse(JSON.stringify(this.serviceEngineerObject));
        this.serviceRequestService
            .exportServiceEngineerList(customer)
            .subscribe(
                (data: any) => {
                    const blob = new Blob([data], {
                        type: "application/octet-stream",
                    });
                    FileSaver.saveAs(blob, "ServiceEngineer.xlsx");
                },
                (err) => {
                    const blob1 = new Blob([err.error.text], {
                        type: "application/octet-stream",
                    });
                    FileSaver.saveAs(blob1, "ServiceEngineer.xlsx");
                }
            );
    }

    getServiceEngineerCount() {
        this.serviceRequestService
            .getServiceEngineerCount(this.serviceEngineerObject)
            .subscribe(
                (data: any) => {
                    this.totalRecords = data.count;

                    console.log(
                        "service Engineer Count",
                        this.serviceEngineerList
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getProductCategoryList() {
        this.productService.getProductCategoryList().subscribe(
            (data: any) => {
                this.productCategoryDropdownList = data;
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    activeDeactiveCustomer(service: ServiceEngineerList) {
        let deactiveActiveString: string;
        if (service.is_active == false) {
            deactiveActiveString = "Activate";
        } else if (service.is_active == true) {
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
                this.serviceRequestService
                    .statusForServiceEngineer(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Service Engineer " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getServiceEngineerList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Service Engineer " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getServiceEngineerList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }
}
