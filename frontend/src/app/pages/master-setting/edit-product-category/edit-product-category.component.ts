import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { ProductCategory } from "src/app/model/Product";
import { ProductService } from "src/app/service/product.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";

@Component({
    selector: "app-edit-product-category",
    templateUrl: "./edit-product-category.component.html",
    styleUrls: ["./edit-product-category.component.scss"],
})
export class EditProductCategoryComponent implements OnInit {
    @Input() productCategoryObject: ProductCategory = {} as ProductCategory;
    @Output() openEditDialogModuleEventForProductCategory: EventEmitter<any> =
        new EventEmitter();
    sopFields: string[] = [""];
    problemStatementFields: string[] = [""];
    posValue: string = "";
    sopValue: string = "";
    dialogWidth = "850px";
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    hideButtonView: boolean = false;
    pageSize: number = 5;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;

    constructor(
        private productService: ProductService,
        private sweetAlertService: SweetAlertService
    ) {}

    ngOnInit(): void {
        this.sopFields = this.productCategoryObject.sops;
        this.sopFields.push("");
        this.problemStatementFields = this.productCategoryObject.pss;
        this.problemStatementFields.push("");
    }

    setTableSetting() {
        this.searchPlaceholder = "Product Name";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: true,
            delete: false,
            edit: true,
            view: false,
            active: false,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: false,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
        };
    }

    addSopField() {
        this.sopFields.push(this.sopValue);
        this.sopValue = "";
    }

    addproblemStatementField() {
        this.problemStatementFields.push(this.posValue);
        this.posValue = "";
    }

    closeDialogueBoxEntity() {
        this.openEditDialogModuleEventForProductCategory.emit(false);
    }
    updateProductCategory() {
        let pssFieldsTemp = JSON.parse(
            JSON.stringify(this.problemStatementFields)
        );
        let sopFieldsTemp = JSON.parse(JSON.stringify(this.sopFields));
        this.productCategoryObject.sops = sopFieldsTemp;
        this.productCategoryObject.pss = pssFieldsTemp;

        this.productService
            .updateProductCategory(
                this.productCategoryObject.uuid,
                this.productCategoryObject
            )
            .subscribe(
                (data) => {
                    this.closeDialogueBoxEntity();
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }
}
