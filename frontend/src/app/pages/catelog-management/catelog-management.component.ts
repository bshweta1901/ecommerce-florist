import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CatelogProductMaster, ProductCategory } from "src/app/model/Product";
import { AuthService } from "src/app/service/auth.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { ProductService } from "src/app/service/product.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import Swal from "sweetalert2";
import { HttpErrorResponse } from "@angular/common/http";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
declare var require: any;
const FileSaver = require("file-saver");

@Component({
    selector: "app-catelog-management",
    templateUrl: "./catelog-management.component.html",
    styleUrls: ["./catelog-management.component.scss"],
})
export class CatelogManagementComponent implements OnInit {
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEventForSparePartCovered: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;
    customerId: string;
    dialogWidth = "650px";
    statusList: any[] = [];
    catelogProductObject: CatelogProductMaster = {} as CatelogProductMaster;
    catelogProductList: CatelogProductMaster[] = [];
    catelogProductCount: CatelogProductMaster[] = [];
    visibleSidebar: boolean = false;
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedStatus: ProductCategory = {} as ProductCategory;
    productCategoryDropdownList: ProductCategory[] = [];

    constructor(
        private productService: ProductService,
        public authService: AuthService,
        private sweetAlertService: SweetAlertService,
        public router: Router,
        private predefinedService: PredefinedService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getCatelogProductList();
        this.getServiceRequestStatus("SERVICE-REQUEST-STATUS");
        this.getCatelogProductCount();
        this.getProductCategoryList();
    }
    setTableSetting() {
        this.searchPlaceholder = "Product Name";
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
            addCatelog: true,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
            search: true,
        };
        this.tableColsEvent = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "product_name",
                header: "Product Name",
                fieldType: "text",
            },
            {
                field: "product_category_name",
                header: "Product Category",
                fieldType: "text",
            },
            {
                field: "approx_life",
                header: "Approx Life",
                fieldType: "text",
            },
            {
                field: "standard_price",
                header: "Standard Price",
                fieldType: "text",
            },
            {
                field: "selling_price",
                header: "Selling Price",
                fieldType: "text",
            },
            {
                field: "sap_oracle_code",
                header: "ERP GL Code",
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
        this.openAddDialogModuleEventForSparePartCovered = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        this.catelogProductObject.page = event.page + 1;
        this.catelogProductObject.per_page = this.pageSize;
        this.getCatelogProductList();
    }
    navigateToSparePart(
        catelogId: CatelogProductMaster,
        action: "edit" | "view"
    ) {
        const url = `/panel/add-catelog-management/${catelogId.uuid}`;

        const navigationExtras = {
            queryParams: { action },
        };

        this.router.navigate([url], navigationExtras);
    }

    editEvent(sparePartId: CatelogProductMaster) {
        this.navigateToSparePart(sparePartId, "edit");
    }

    viewEntity(sparePartId: CatelogProductMaster) {
        this.navigateToSparePart(sparePartId, "view");
    }

    searchData($event) {
        this.catelogProductObject.search_by = $event;
        this.getCatelogProductList();
    }

    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    deactiveEntity($event) {}

    saveEventDialog() {
        this.openAddDialogModuleEventForSparePartCovered = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    searchFilter() {
        this.catelogProductObject.product_category_uuid =
            this.selectedStatus?.uuid;
        this.getCatelogProductList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.catelogProductObject = {} as CatelogProductMaster;
        this.predefinedMasterObject = new PredefinedMaster();
        this.getCatelogProductList();
        this.visibleSidebar = false;
    }

    getServiceRequestStatus(type: string) {
        this.predefinedMasterObject.entity_type = type;
        this.predefinedService
            .getServiceRequestStatus(this.predefinedMasterObject)
            .subscribe((data: any) => {
                switch (type) {
                    case "SERVICE-REQUEST-STATUS":
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

    getCatelogProductList() {
        this.productService
            .getCatelogProductList(this.catelogProductObject)
            .subscribe(
                (data: any) => {
                    this.catelogProductList = data;
                    data.forEach((product) => {
                        product.status =
                            product.is_active === true ? "Active" : "Deactive";
                    });
                },
                (err) => {
                    console.log(err, "ERR");
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

    deleteCatelogProduct(event) {
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
                let delCustomer = this.catelogProductObject;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.productService
                    .deleteCatelogProduct(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Catelog Product successfully.",
                                "success"
                            );
                            this.getCatelogProductList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Catelog Product successfully.",
                                        "success"
                                    );
                                    this.getCatelogProductList();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    exportCatelogList() {
        let customer = JSON.parse(JSON.stringify(this.catelogProductObject));
        this.productService.exportCatelogList(customer).subscribe(
            (data: any) => {
                const blob = new Blob([data], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob, "Catelog.xlsx");
            },
            (err) => {
                const blob1 = new Blob([err.error.text], {
                    type: "application/octet-stream",
                });
                FileSaver.saveAs(blob1, "Catelog.xlsx");
            }
        );
    }

    getCatelogProductCount() {
        this.productService
            .getCatelogProductCount(this.catelogProductObject)
            .subscribe(
                (data: any) => {
                    this.totalRecords = data.count;
                },
                (err) => {
                    console.log(err, "ERR");
                }
            );
    }

    activeDeactiveCustomer(service: CatelogProductMaster) {
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
                this.productService
                    .statusForProductCategory(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Product Catelog & Pricing " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getCatelogProductList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Product Catelog & Pricing " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getCatelogProductList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }
}
