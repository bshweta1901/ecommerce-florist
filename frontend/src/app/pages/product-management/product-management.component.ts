import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ProductMaster } from "src/app/model/ProductMaster.model";
import { AuthService } from "src/app/service/auth.service";
import { ChillerService } from "src/app/service/chiller.service";
import { ProductService } from "src/app/service/product.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import Swal from "sweetalert2";
import * as FileSaver from "file-saver";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { PredefinedService } from "src/app/service/predefined.service";
import { Freezer } from "src/app/model/Freezer.model";
import { Factory } from "src/app/model/Factory.model";
import { FactoryService } from "src/app/service/factory.service";

@Component({
    selector: "app-product-management",
    templateUrl: "./product-management.component.html",
    styleUrls: ["./product-management.component.scss"],
})
export class ProductManagementComponent implements OnInit {
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    product: ProductMaster = new ProductMaster();
    productExport: ProductMaster = new ProductMaster();
    hideButtonView: boolean = false;
    pageSize: number = 10;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;
    dialogWidth = "650px";
    statusList: any[] = [];
    freezer: Freezer = new Freezer();
    factory: Factory = new Factory();
    visibleSidebar: boolean = false;
    dummyData: any[] = [];
    constructor(
        private factoryService: FactoryService,
        private predefinedService: PredefinedService,
        private chillerService: ChillerService,
        private productService: ProductService,
        private sweetAlertService: SweetAlertService,
        public authService: AuthService,
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        // this.getProductList();
        // this.getStatusList();
    }
    setTableSetting() {
        this.searchPlaceholder = "Customer Management";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            search: true,
            filter: true,
            // filter: true,
            clear: false,
            export: false,
            paginate: true,
            delete: true,
            edit: true,
            view: false,
            active: true,
            deactive: true,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: false,
            addClient: true,
            createOrder: true,
            addCatelog: false,
            addServicePerson: false,
        };
        this.tableColsEvent = [
            // { field: 'id', header: 'ID', fieldType: "text" },
        ];
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        this.product.pageNumber = event.page;
        this.product.pageSize = this.pageSize;

        this.auth.setFilterSessionData("Filter", this.product);
        // this.getProductList();
    }

    addEvent() {
        this.titleEVent = "Add Product";
        this.product = new ProductMaster();
        this.openAddDialogModuleEvent = true;
        this.hideButtonView = true;
    }

    EditEvent($event) {
        this.titleEVent = "Update Product";
        this.product = $event;
        this.productService.setProductSession(this.product);
        this.getProductById(this.product);
    }

    searchData($event) {
        this.product.searchValue = $event;
        this.getProductList();
    }

    deleteEvent(event) {
        //console.log(event);
        if (event.isDeactivate == "N") {
            var title = "Kindly deactive the product before deleting?";
            this.deactiveProductConfirmation(event);
        } else {
            var title = "Are you sure, you want to delete, there is no undo?";

            Swal.fire({
                title: title,
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
                    let product = new ProductMaster();
                    const productId = event;
                    product.uuid = productId.uuid;
                    this.productService.deleteProductById(product).subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getProductList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getProductList();
                                } else {
                                }
                            }
                        }
                    );
                }
            });
        }
    }

    activeEntity($event) {
        this.activeProductConfirmation($event);
    }
    openSidebar() {
        this.visibleSidebar = true;
        this.getProductList();
    }

    activeProductConfirmation($event) {
        Swal.fire({
            title: "Kindly confirm to Set Status active?",
            //text: "You able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, active it!",
        }).then((result) => {
            if (result.isConfirmed) {
                let product = new ProductMaster();
                const productId = $event;
                product.uuid = productId.uuid;

                this.productService.statusProductById(product).subscribe(
                    (data) => {
                        this.sweetAlertService.successAlert(
                            "Product is Activated"
                        );
                        this.product = new ProductMaster();
                        this.getProductList();
                    },
                    (err: HttpErrorResponse) => {
                        if (err.status === 200) {
                            let jsonString = err.error.text;
                            jsonString = jsonString.substr(
                                0,
                                jsonString.indexOf('{"timestamp"')
                            );
                        }
                    }
                );
            }
        });
    }

    deactiveEntity($event) {
        this.deactiveProductConfirmation($event);
    }

    deactiveProductConfirmation($event) {
        Swal.fire({
            title: "Kindly confirm to Set Status deactive?",
            //text: "You able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, deactivate it!",
        }).then((result) => {
            if (result.isConfirmed) {
                let product = new ProductMaster();
                const productId = $event;
                console.log(productId);
                product.uuid = productId.uuid;

                this.productService.statusProductById(product).subscribe(
                    (data) => {
                        this.sweetAlertService.successAlert(
                            "Product is Deactivated"
                        );
                        this.product = new ProductMaster();
                        this.getProductList();
                    },
                    (err: HttpErrorResponse) => {
                        if (err.status === 200) {
                            let jsonString = err.error.text;
                            jsonString = jsonString.substr(
                                0,
                                jsonString.indexOf('{"timestamp"')
                            );
                        }
                    }
                );
            }
        });
    }

    saveEventDialog() {
        this.openAddDialogModuleEvent = false;
        this.product = new ProductMaster();
        this.getProductList();
        // this.getProjectListLength();
    }

    getProductById(product: ProductMaster) {
        this.product = product;
        //console.log(this.service, "service id data");
        this.productService.getProductById(this.product).subscribe(
            (data) => {
                //console.log(data.data, 'service data');
                this.product = data.data;
                this.productService.setProductSession(this.product);
                this.openAddDialogModuleEvent = true;
                this.hideButtonView = false;
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"')
                    );
                }
            }
        );
    }
    searchFilter() {
        this.getProductList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.product = new ProductMaster();
        this.getProductList();
        this.visibleSidebar = false;
    }

    getProductList() {
        this.factory = this.factoryService.getFactorySession();
        //console.log(this.factory, 'fact session data');
        this.product.factoryMaster = this.factory.factoryMaster;
        // console.log(sessiondata, 'session data');
        this.product.pageNumber = this.product?.pageNumber
            ? this.product?.pageNumber
            : this.pageNumber;
        this.product.pageSize = this.product?.pageSize
            ? this.product?.pageSize
            : this.pageSize;
        this.product.isAdmin = true;
        if (
            this.product.isDeactivate != null &&
            this.product.isDeactivate != undefined &&
            this.product.isDeactivate.lookupValue != null
        ) {
            this.product.isDeactivate = this.product.isDeactivate.lookupValue;
        }
        // console.log(this.project, 'project data on list');
        //this.staff.searchBy = 'SERVICE'
        this.productService.getProductList(this.product).subscribe(
            (data) => {
                this.eventList = data.data;
                //console.log(this.eventList,'service list data');
                this.getProductListLength();
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"}')
                    );
                }
            }
        );
    }

    getProductListLength() {
        this.product.pageNumber = this.product?.pageNumber
            ? this.product?.pageNumber
            : this.pageNumber;
        this.product.pageSize = this.product?.pageSize
            ? this.product?.pageSize
            : this.pageSize;
        this.product.isAdmin = true;
        this.productService.getProductListLength(this.product).subscribe(
            (data) => {
                this.totalRecords = data.data;
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"}')
                    );
                }
            }
        );
    }

    exportEntity() {
        this.productExport.isAdmin = true;

        this.productService.getProductListExport(this.productExport).subscribe(
            (data: any) => {
                const url = data.data.FileLink;
                //console.log(data,'excel data');
                this.downloadPDF(url);
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"')
                    );
                } else if (err.status === 400) {
                    //console.log(err.error.error.message,'msg');
                    let jsonString = err;
                    this.msg = jsonString.error.error.message;
                    this.sweetAlertService.errorAlert(this.msg);
                }
            }
        );
    }

    downloadPDF(url: string) {
        this.chillerService.downloadPDF(url).subscribe((data: Blob) => {
            this.fileSave = data;
            //console.log(data, 'data.data.file');
            const pdfData: Blob = new Blob([data], {
                type: "application/xlsx",
            });
            //console.log(pdfData, 'pdfData');
            const urlParts = url.split("/");
            const fileName = urlParts[urlParts.length - 1];
            //console.log(fileName, 'fileName');
            // const fileName: string = 'ThematicReport.pdf';
            FileSaver.saveAs(data, fileName);
        });
    }

    getStatusList() {
        let predefined = new PredefinedMaster();
        predefined.filterType = "QUICK";
        predefined.moduleMaster = {
            moduleCode: "PRODUCT-MASTER",
        };
        this.predefinedService.getFilter(predefined).subscribe(
            (data) => {
                this.statusList = data.data;
                //console.log(this.statusList,'chiller status data');

                /* this.statusList.forEach(element => {
          const chiller = this.chiller.status ? this.chiller.status.id : '';
          if (chiller != '') {
            if (element.id == this.chiller.status.id) {
              this.chiller.status = element;
            }
          }
        });*/
                //if(this.chiller.status != null && this.chiller.status != undefined){
                //}
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"}')
                    );
                }
            }
        );
    }
}
