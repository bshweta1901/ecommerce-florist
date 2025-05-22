import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ProductMaster } from "src/app/model/ProductMaster.model";
import { ProductService } from "src/app/service/product.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import Swal from "sweetalert2";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { PredefinedService } from "src/app/service/predefined.service";
import { AuthService } from "src/app/service/auth.service";

@Component({
    selector: "app-product-management",
    templateUrl: "./product-management.component.html",
    styleUrls: ["./product-management.component.scss"],
})
export class ProductManagementComponent implements OnInit {
     tableColsEvent: any[] = [];
        tableSettingsEvent: any = {};
        addData: any = {};
        eventList: any[] = [];
        titleEVent: any;
        openAddDialogModuleEvent: boolean = false;
        product: ProductMaster = new ProductMaster();
        hideButtonView: boolean = false;
        pageSize: number = 10;
        searchPlaceholder: string = "";
        pageNumber: number = 0;
        totalRecords: number;
        msg: any;
        fileSave: any;
        dialogWidth = "650px";
        statusList: any[] = [];
        visibleSidebar: boolean = false;
        dummyData: any[] = [];
    constructor(
        private predefinedService: PredefinedService,
        private productService: ProductService,
        private sweetAlertService: SweetAlertService,
        
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getProductList();
        // this.getStatusList();
    }
    setTableSetting() {
            this.searchPlaceholder = "Product Management";
            this.tableSettingsEvent = {
                // tableFilter: false,
                add: true,
                action: true,
                search: true,
                filter: true,
                addOrderDetailsSparePart:true,
                // allowAdd:true,
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
                { field: 'id', header: 'ID', fieldType: "text" },
                { field: 'name', header: 'Name', fieldType: "text" },
                { field: 'description', header: 'Description', fieldType: "text" },
                { field: 'product_status_name', header: 'Product Status', fieldType: "text" },
                 { field: 'is_default_img_path', header: 'Image', fieldType: "image" },
                { field: 'status', header: 'Status', fieldType: "text" },
            ];
            this.addData={
                'routerLink':'/panel/add-product',
                'name':'Add Product'
            }
        }
    
        closeEventDialog() {
            this.openAddDialogModuleEvent = false;
        }
    
        paginateEvent(event) {
            this.pageSize = event.rows;
            this.product.page = event.page;
            this.product.per_page = this.pageSize;
    
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
                this.deactiveCategoryConfirmation(event);
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
                        let category = new ProductMaster();
                        const categoryId = event;
                        category.id = categoryId.id;
                        this.productService.deleteProductById(category).subscribe(
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
                    let category = new ProductMaster();
                    const productId = $event;
                    category.id = productId.id;
    
                    this.productService.statusProductById(category).subscribe(
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
            this.deactiveCategoryConfirmation($event);
        }
    
        deactiveCategoryConfirmation($event) {
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
                    product.id = productId.id;
    
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
    
        getProductById(products: ProductMaster) {
            this.product = products;
            // debugger
            //console.log(this.service, "service id data");
            this.productService.getProductById(this.product).subscribe(
                (data) => {
                    console.log(data, 'service data');
                    this.product = data;
                    console.log(this.product, 'service data');
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
            //console.log(this.factory, 'fact session data');
            // console.log(sessiondata, 'session data');
            this.product.page = this.product?.page
                ? this.product?.page
                : this.pageNumber;
            this.product.per_page = this.product?.per_page
                ? this.product?.per_page
                : this.pageSize;
            this.product.is_add_on=false
            // console.log(this.project, 'project data on list');
            //this.staff.searchBy = 'SERVICE'
            this.productService.getProductList(this.product).subscribe(
                (data) => {
                    this.eventList = data.data;
                    //console.log(this.eventList,'service list data');
                    this.totalRecords = data.total
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
