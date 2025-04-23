import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import {
    ProductTypeDropDown,
    SparePartManager,
} from "src/app/model/SparePartMaster.model";
import { PredefinedService } from "src/app/service/predefined.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { ProductCategory } from "src/app/model/Product";
import { ProductService } from "src/app/service/product.service";

@Component({
    selector: "app-add-spare-part-management",
    templateUrl: "./add-spare-part-management.component.html",
    styleUrls: ["./add-spare-part-management.component.scss"],
})
export class AddSparePartManagementComponent implements OnInit {
    sparePartManagerObject: SparePartManager = {} as SparePartManager;
    sparePartManagerList: SparePartManager[] = [];
    ProductTypeDropDownObject: ProductTypeDropDown = {} as ProductTypeDropDown;
    ProductTypeDropDownList: ProductTypeDropDown[] = [];
    productCategoryDropdownList: ProductCategory[] = [];
    selectedProductTypeDropDown: ProductTypeDropDown =
        {} as ProductTypeDropDown;
    customerId: string;
    id: string;
    statusList: PredefinedMaster[] = [];
    selectedStatus: PredefinedMaster = {} as PredefinedMaster;
    typeList: PredefinedMaster[] = [];
    selectedType: PredefinedMaster = {} as PredefinedMaster;
    predefineObject: PredefinedMaster = {} as PredefinedMaster;
    selectedProductCategory: ProductCategory = {} as ProductCategory;
    addSparePartForm: FormGroup;
    sparePartId: boolean = false;
    actionForEdit: boolean = false;
    actionForView: boolean = false;

    constructor(
        private ServiceRequestService: ServiceRequestService,
        private sweetAlertService: SweetAlertService,
        private predefinedService: PredefinedService,
        public router: Router,
        private route: ActivatedRoute,
        private productService: ProductService
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get("id");
        this.route.queryParams.subscribe(() => {
            if (!this.id) {
                this.getProductType();
                this.getProductCategoryList();
                this.getPredefinedByType("PACKAGE-SERVICE-TYPE");
                this.getPredefinedByType("SPARE-PART-STATUS");
                return;
            }
            this.route.queryParams.subscribe((queryParams) => {
                const action = queryParams["action"];
                if (action === "edit") {
                    this.actionForEdit = true;
                } else if (action === "view") {
                    this.actionForView = true;
                }
                this.getProductType();
                this.getProductCategoryList();
                this.getPredefinedByType("SPARE-PART-STATUS");
                this.getPredefinedByType("PACKAGE-SERVICE-TYPE");
                this.getSparePartDetails();
            });
        });

        this.addSparePartForm = new FormGroup({
            uuid: new FormControl(""),
            selectedProductCategory: new FormControl("", [Validators.required]),
            spare_part_name: new FormControl("", Validators.required),
            spare_part_type_name: new FormControl("", Validators.required),
            sku: new FormControl("", [Validators.required]),
            spare_part_status_name: new FormControl("", [Validators.required]),
            approx_life: new FormControl("", Validators.required),
            standard_price: new FormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            selling_price: new FormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            tax: new FormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            description: new FormControl(""),
        });
    }

    resetSparePartManager() {
        this.sparePartManagerObject = {} as SparePartManager;
        this.selectedProductTypeDropDown = {} as ProductTypeDropDown;
        this.selectedType = {} as PredefinedMaster;
        this.selectedProductCategory = {} as ProductCategory;
    }

    getPredefinedByType(type: string) {
        let predefined = new PredefinedMaster();
        predefined.entity_type = type;
        predefined.alphabeticOrder = true;
        this.predefinedService
            .getPredefinedByTypeAndCode(predefined)
            .subscribe((data: any) => {
                switch (type) {
                    case "SPARE-PART-STATUS":
                        this.typeList = data.data;
                        // if (this.id) {
                        //     this.getSparePartDetails();
                        // }
                        break;
                    case "PACKAGE-SERVICE-TYPE":
                        this.statusList = data.data;
                        break;
                    default:
                        break;
                }
            });
    }

    getProductCategoryList() {
        this.productService.getProductCategoryList().subscribe(
            (data: any) => {
                this.productCategoryDropdownList = data;
                // if (this.id) {
                //     this.getSparePartDetails();
                // }
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getProductType() {
        this.ServiceRequestService.getProductType(
            this.sparePartManagerObject
        ).subscribe(
            (data: any) => {
                this.ProductTypeDropDownList = data;
                // if (this.id) {
                //     this.getSparePartDetails();
                // }
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getSparePartDetails() {
        this.ServiceRequestService.getSparePartDetails(this.id).subscribe(
            (data: any) => {
                this.sparePartManagerObject = data;

                this.selectedProductTypeDropDown =
                    this.ProductTypeDropDownList.find(
                        (item) =>
                            item.product_type ===
                            data.spare_part_type.product_type
                    );

                this.selectedType = this.typeList.find(
                    (item) => item.name === data.spare_part_status.name
                );

                this.selectedProductCategory =
                    this.productCategoryDropdownList.find(
                        (item) =>
                            item.product_category ===
                            data.product_category.product_category
                    );

                // this.getPredefinedByType("SPARE-PART-STATUS");
                // this.getProductCategoryList();
                // this.getProductType();
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    saveSparePartManager() {
        this.addSparePartForm.markAllAsTouched();
        if (!this.addSparePartForm.valid) {
            return;
        }
        this.sparePartManagerObject.product_category_uuid =
            this.selectedProductCategory.uuid;
        this.sparePartManagerObject.spare_part_type_uuid =
            this.selectedProductTypeDropDown.uuid;
        this.sparePartManagerObject.spare_part_status_uuid =
            this.selectedType.uuid;

        const fd = new FormData();
        fd.append("data", JSON.stringify(this.sparePartManagerObject));
        this.ServiceRequestService.saveSparePartManager(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.router.navigate(["/panel/spare-part-management"]);
            },
            (err) => {
                this.sweetAlertService.errorAlert("Something Went Wrong");
            }
        );
    }

    updateSparePartManager() {
        this.addSparePartForm.markAllAsTouched();
        if (!this.addSparePartForm.valid) {
            return;
        }

        this.sparePartManagerObject.spare_part_type_uuid =
            this.selectedProductTypeDropDown.uuid;
        this.sparePartManagerObject.spare_part_status_uuid =
            this.selectedType.uuid;
        this.sparePartManagerObject.product_category_uuid =
            this.selectedProductCategory.uuid;

        this.sparePartManagerObject.product_category = undefined;
        this.sparePartManagerObject.spare_part_type = undefined;
        this.sparePartManagerObject.spare_part_status = undefined;
        this.sparePartManagerObject.is_delete = undefined;
        this.sparePartManagerObject.is_active = undefined;
        this.sparePartManagerObject.created_at = undefined;
        this.sparePartManagerObject.modified_at = undefined;
        this.sparePartManagerObject.created_by = undefined;
        this.sparePartManagerObject.modified_by = undefined;

        const fd = new FormData();
        fd.append("data", JSON.stringify(this.sparePartManagerObject));
        this.ServiceRequestService.updateSparePartManager(
            this.sparePartManagerObject.uuid,
            fd
        ).subscribe(
            (data) => {
                this.sweetAlertService.successAlert(
                    "Data updated successfully!"
                );
                this.router.navigate(["/panel/spare-part-management"]);
            },
            (err) => {
                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    checkStandardAndSelling() {
        const standardPrice = Number(
            this.sparePartManagerObject.standard_price
        );
        const sellingPrice = Number(this.sparePartManagerObject.selling_price);
        if (sellingPrice < standardPrice) {
            this.sweetAlertService.errorAlert(
                "Selling Price cannot be less than Standard Price!"
            );

            this.sparePartManagerObject.selling_price = null;
        }
    }
}
