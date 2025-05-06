import { HttpErrorResponse } from "@angular/common/http";
import { ProductMaster } from "src/app/model/ProductMaster.model";
import { ProductService } from "src/app/service/product.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import Swal from "sweetalert2";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { PredefinedService } from "src/app/service/predefined.service";
import { AuthService } from "src/app/service/auth.service";
import { Component, OnInit } from '@angular/core';
import { CategoryMaster } from "src/app/model/CategoryMaster.model";
import { CategoryService } from "src/app/service/category.service";

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    addData: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    category: CategoryMaster = new CategoryMaster();
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
        private categoryService: CategoryService,
        private sweetAlertService: SweetAlertService,
        
        private auth: AuthService
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        this.getCategoryList();
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
            { field: 'category_img_path', header: 'Image', fieldType: "image" },
            { field: 'status', header: 'Status', fieldType: "text" },
        ];
        this.addData={
            'routerLink':'panel/add-cate',
            'name':'Add Category'
        }
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        this.category.page = event.page;
        this.category.per_page = this.pageSize;

        this.auth.setFilterSessionData("Filter", this.category);
        // this.getProductList();
    }

    addEvent() {
        this.titleEVent = "Add Category";
        this.category = new CategoryMaster();
        this.openAddDialogModuleEvent = true;
        this.hideButtonView = true;
    }

    EditEvent($event) {
        this.titleEVent = "Update Category";
        this.category = $event;
        this.categoryService.setCategorySession(this.category);
        this.getCategoryById(this.category);
    }

    searchData($event) {
        this.category.searchValue = $event;
        this.getCategoryList();
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
                    let category = new CategoryMaster();
                    const categoryId = event;
                    category.id = categoryId.id;
                    this.categoryService.deleteCategoryById(category).subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getCategoryList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getCategoryList();
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
        this.getCategoryList();
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
                let category = new CategoryMaster();
                const productId = $event;
                category.id = productId.id;

                this.categoryService.statusCategoryById(category).subscribe(
                    (data) => {
                        this.sweetAlertService.successAlert(
                            "Product is Activated"
                        );
                        this.category = new CategoryMaster();
                        this.getCategoryList();
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
                let product = new CategoryMaster();
                const productId = $event;
                console.log(productId);
                product.id = productId.id;

                this.categoryService.statusCategoryById(product).subscribe(
                    (data) => {
                        this.sweetAlertService.successAlert(
                            "Product is Deactivated"
                        );
                        this.category = new CategoryMaster();
                        this.getCategoryList();
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
        this.category = new CategoryMaster();
        this.getCategoryList();
        // this.getProjectListLength();
    }

    getCategoryById(product: CategoryMaster) {
        this.category = product;
        // debugger
        //console.log(this.service, "service id data");
        this.categoryService.getCategoryById(this.category).subscribe(
            (data) => {
                console.log(data, 'service data');
                this.category = data;
                console.log(this.category, 'service data');
                this.categoryService.setCategorySession(this.category);
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
        this.getCategoryList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        this.category = new CategoryMaster();
        this.getCategoryList();
        this.visibleSidebar = false;
    }

    getCategoryList() {
        //console.log(this.factory, 'fact session data');
        // console.log(sessiondata, 'session data');
        this.category.page = this.category?.page
            ? this.category?.page
            : this.pageNumber;
        this.category.per_page = this.category?.per_page
            ? this.category?.per_page
            : this.pageSize;
        // console.log(this.project, 'project data on list');
        //this.staff.searchBy = 'SERVICE'
        this.categoryService.getCategoryList(this.category).subscribe(
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
