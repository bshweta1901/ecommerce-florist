import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SubCategoryMaster } from 'src/app/model/SubCategoryMaster.model';
import { AuthService } from 'src/app/service/auth.service';
import { CategoryService } from 'src/app/service/category.service';
import { PredefinedService } from 'src/app/service/predefined.service';
import { SweetAlertService } from 'src/app/service/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-category-mangement',
  templateUrl: './sub-category-mangement.component.html',
  styleUrls: ['./sub-category-mangement.component.scss']
})
export class SubCategoryMangementComponent implements OnInit {
    tableColsEvent: any[] = [];
      tableSettingsEvent: any = {};
      addData: any = {};
      eventList: any[] = [];
      titleEVent: any;
      openAddDialogModuleEvent: boolean = false;
      category: SubCategoryMaster = new SubCategoryMaster();
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
            private categoryService: CategoryService,
            private sweetAlertService: SweetAlertService,
            
            private auth: AuthService){}
  

  ngOnInit(): void {
    this.setTableSetting();
    this.getSubCategoryList();
  }

  setTableSetting() {
    this.searchPlaceholder = "Sub-Category Management";
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
   addEvent() {
        this.titleEVent = "Add Sub Category";
        this.category = new SubCategoryMaster();
        this.openAddDialogModuleEvent = true;
        this.hideButtonView = true;
    }
    paginateEvent(event) {
      this.pageSize = event.rows;
      this.category.page = event.page;
      this.category.per_page = this.pageSize;

      this.auth.setFilterSessionData("Filter", this.category);
      // this.getProductList();
  }
  EditEvent($event) {
    this.titleEVent = "Update Product";
    this.category = $event;
    this.categoryService.setSubCategorySession(this.category);
    this.getCategoryById(this.category);
}
   getCategoryById(product: SubCategoryMaster) {
        this.category = product;
        // debugger
        //console.log(this.service, "service id data");
        this.categoryService.getSubCategoryById(this.category).subscribe(
            (data) => {
                console.log(data, 'service data');
                this.category = data;
                console.log(this.category, 'service data');
                this.categoryService.setSubCategorySession(this.category);
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
activeEntity($event) {
  this.activeProductConfirmation($event);
}
    openSidebar() {
        this.visibleSidebar = true;
        this.getSubCategoryList();
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
                let category = new SubCategoryMaster();
                const productId = $event;
                category.id = productId.id;

                this.categoryService.statusSubCategoryById(category).subscribe(
                    (data) => {
                        this.sweetAlertService.successAlert(
                            "Product is Activated"
                        );
                        this.category = new SubCategoryMaster();
                        this.getSubCategoryList();
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
closeEventDialog() {
  this.openAddDialogModuleEvent = false;
}
   getSubCategoryList() {
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
        this.categoryService.getSubcategoryList(this.category).subscribe(
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
                  let product = new SubCategoryMaster();
                  const productId = $event;
                  console.log(productId);
                  product.id = productId.id;
  
                  this.categoryService.statusSubCategoryById(product).subscribe(
                      (data) => {
                          this.sweetAlertService.successAlert(
                              "Product is Deactivated"
                          );
                          this.category = new SubCategoryMaster();
                          this.getSubCategoryList();
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
                          let category = new SubCategoryMaster();
                          const categoryId = event;
                          category.id = categoryId.id;
                          this.categoryService.deleteSubcategoryById(category).subscribe(
                              (data) => {
                                  Swal.fire(
                                      "Deleted!",
                                      "Data deleted successfully.",
                                      "success"
                                  );
                                  this.getSubCategoryList();
                              },
                              (error) => {
                                  if (error instanceof HttpErrorResponse) {
                                      if (error.status === 200) {
                                          Swal.fire(
                                              "Deleted!",
                                              "Data deleted successfully.",
                                              "success"
                                          );
                                          this.getSubCategoryList();
                                      } else {
                                      }
                                  }
                              }
                          );
                      }
                  });
              }
          }
  

              searchFilter() {
                  this.getSubCategoryList();
                  this.visibleSidebar = false;
              }
              resetFilter() {
                  this.category = new SubCategoryMaster();
                  this.getSubCategoryList();
                  this.visibleSidebar = false;
              }
}
