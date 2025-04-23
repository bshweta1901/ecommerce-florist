import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SparePartManager } from "src/app/model/SparePartMaster.model";
import { AuthService } from "src/app/service/auth.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { PredefinedService } from "src/app/service/predefined.service";
import { ProductCategory } from "src/app/model/Product";
import { ProductService } from "src/app/service/product.service";
declare var require: any;
const FileSaver = require("file-saver");

@Component({
    selector: "app-spare-part-management",
    templateUrl: "./spare-part-management.component.html",
    styleUrls: ["./spare-part-management.component.scss"],
})
export class SparePartManagementComponent implements OnInit {
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
    dummyData: any[] = [];
    customerId: string;
    visibleSidebar: boolean = false;
    sparePartManagerObject: SparePartManager = {} as SparePartManager;
    sparePartManagerCount: SparePartManager[] = [];
    sparePartManagerList: SparePartManager[] = [];
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedStatus: PredefinedMaster = {} as PredefinedMaster;
    selectedProductCategory: ProductCategory = {} as ProductCategory;
    productCategoryDropdownList: ProductCategory[] = [];

    constructor(
        public authService: AuthService,
        private ServiceRequestService: ServiceRequestService,
        private sweetAlertService: SweetAlertService,
        public router: Router,
        private predefinedService: PredefinedService,
        private productService: ProductService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getSparePartManagerList();
        this.getServiceRequestStatus("SPARE-PART-STATUS");
        this.getSparePartManagerCount();
        this.getProductCategoryList();
    }
    setTableSetting() {
        this.searchPlaceholder = "Spare Name";
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
            addSparePart: true,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
            search: true,
        };
        this.tableColsEvent = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "product_category_name",
                header: "Product Category",
                fieldType: "text",
            },
            {
                field: "spare_part_type_name",
                header: "Spare type",
                fieldType: "text",
            },
            {
                field: "spare_part_name",
                header: "Spare Name",
                fieldType: "text",
            },
            {
                field: "standard_price",
                header: "Standard Price",
                fieldType: "text",
            },
            {
                field: "sku",
                header: "SKU",
                fieldType: "text",
            },
            {
                field: "selling_price",
                header: "Selling Price",
                fieldType: "text",
            },
            {
                field: "approx_life",
                header: "Approx Life",
                fieldType: "text",
            },

            {
                field: "spare_part_status_name",
                header: "Status",
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
        this.sparePartManagerObject.page = event.page + 1;
        this.sparePartManagerObject.per_page = this.pageSize;
        this.getSparePartManagerList();
    }

    addEvent() {
        // this.titleEVent="Add Product";
    }

    navigateToSparePart(
        sparePartId: SparePartManager,
        action: "edit" | "view"
    ) {
        const url = `/panel/add-spare-part-management/${sparePartId.uuid}`;

        const navigationExtras = {
            queryParams: { action },
        };

        this.router.navigate([url], navigationExtras);
    }

    editEvent(sparePartId: SparePartManager) {
        this.navigateToSparePart(sparePartId, "edit");
    }

    viewEntity(sparePartId: SparePartManager) {
        this.navigateToSparePart(sparePartId, "view");
    }

    searchData($event) {
        this.sparePartManagerObject.search_by = $event;
        this.getSparePartManagerList();
    }

    deleteEvent(event) {}

    activeEntity($event) {}
    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    saveEventDialog() {
        this.openAddDialogModuleEvent = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    searchFilter() {
        this.sparePartManagerObject.spare_part_status_uuid =
            this.predefinedMasterObject.uuid;
        this.sparePartManagerObject.product_category_uuid =
            this.selectedProductCategory.uuid;
        this.getSparePartManagerList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.sparePartManagerObject = {} as SparePartManager;
        this.predefinedMasterObject = new PredefinedMaster();
        this.selectedProductCategory = {} as ProductCategory;
        this.getSparePartManagerList();
        this.visibleSidebar = false;
    }

    getServiceRequestStatus(type: string) {
        this.predefinedMasterObject.entity_type = type;
        this.predefinedService
            .getServiceRequestStatus(this.predefinedMasterObject)
            .subscribe((data: any) => {
                switch (type) {
                    case "SPARE-PART-STATUS":
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

    getSparePartManagerList() {
        this.ServiceRequestService.getSparePartManagerList(
            this.sparePartManagerObject
        ).subscribe(
            (data: any) => {
                this.sparePartManagerList = data;

                data.forEach((sparePart) => {
                    sparePart.status =
                        sparePart.is_active === true ? "Active" : "Deactive";
                });

                console.log("service Engineer List", this.sparePartManagerList);
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    exportSparePartList() {
        let customer = JSON.parse(JSON.stringify(this.sparePartManagerObject));
        this.ServiceRequestService.exportSparePartList(customer).subscribe(
            (data: any) => {
                const blob = new Blob([data], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob, "SparePart.xlsx");
            },
            (err) => {
                const blob1 = new Blob([err.error.text], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob1, "SparePart.xlsx");
            }
        );
    }

    getSparePartManagerCount() {
        this.ServiceRequestService.getSparePartManagerCount(
            this.sparePartManagerObject
        ).subscribe(
            (data: any) => {
                this.totalRecords = data.count;

                console.log("service Engineer List", this.sparePartManagerList);
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    // deleteSparePartMaster(event) {
    //     Swal.fire({
    //         text: "You won't be able to revert this!",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#3085d6",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Yes, delete it!",
    //     }).then((result) => {
    //         if (result.dismiss != null && result.dismiss != undefined) {
    //             Swal.close();
    //         } else {
    //             let delCustomer = this.sparePartManagerObject;
    //             const customerId = event;
    //             delCustomer.uuid = customerId.uuid;
    //             this.ServiceRequestService.deleteSparePartMaster(
    //                 delCustomer.uuid
    //             ).subscribe(
    //                 (data) => {
    //                     Swal.fire(
    //                         "Deleted!",
    //                         "Spare Part Master successfully.",
    //                         "success"
    //                     );
    //                     this.getSparePartManagerList();
    //                 },
    //                 (error) => {
    //                     if (error instanceof HttpErrorResponse) {
    //                         if (error.status === 200) {
    //                             Swal.fire(
    //                                 "Deleted!",
    //                                 "Spare Part Master successfully.",
    //                                 "success"
    //                             );
    //                             this.getSparePartManagerList();
    //                         } else {
    //                         }
    //                     }
    //                 }
    //             );
    //         }
    //     });
    // }

    activeDeactiveCustomer(service: SparePartManager) {
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
                this.ServiceRequestService.statusForSparePart(
                    service.uuid
                ).subscribe((data) => {
                    console.log(data, "datadata");

                    Swal.fire({
                        icon: "success",

                        title:
                            "Spare Part Master " +
                            deactiveActiveString +
                            " successfully!",
                    });
                    this.getSparePartManagerList();

                    (error) => {
                        if (error instanceof HttpErrorResponse) {
                            if (error.status === 200) {
                                Swal.fire({
                                    icon: "success",

                                    title:
                                        "Spare Part Master " +
                                        deactiveActiveString +
                                        " successfully!",
                                });
                                this.getSparePartManagerList();
                            } else {
                            }
                        }
                    };
                });
            }
        });
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
}
