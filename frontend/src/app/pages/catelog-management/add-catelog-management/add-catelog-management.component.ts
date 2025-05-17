import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Package } from "src/app/model/Package.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import {
    CatelogProductMaster,
    CreatePackage,
    ProductCategory,
    PsSop,
    SparePart,
    UploadEvent,
} from "src/app/model/Product";
import { AuthService } from "src/app/service/auth.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { ProductServiceService } from "src/app/service/product-service.service";
import { ProductService } from "src/app/service/product.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import Swal from "sweetalert2";
import { SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "app-add-catelog-management",
    templateUrl: "./add-catelog-management.component.html",
    styleUrls: ["./add-catelog-management.component.scss"],
})
export class AddCatelogManagementComponent implements OnInit {
    selectedCategory: any;
    addedPackages: Array<{ selectedCategory: any }> = [];
    tableColsEvent: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEventForSparePartCovered: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 5;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    isDisabled: boolean = true;
    fileSave: any;
    dialogWidth = "650px";
    maintenanceList: any[] = [];
    packageServiceList: any[] = [];
    filteredPackageServiceListForWarranty: boolean = false;
    filteredPackageServiceListForAMC: boolean = false;
    filteredPackageServiceListForCAMC: boolean = false;
    filteredPackageServiceListForOnDemand: boolean = false;
    filteredPackageServiceListForInstallation: boolean = false;
    saveProductFirstTime: boolean = false;
    showPackageDropdown: boolean = false;
    visibleSidebar: boolean = false;
    checkPackageType: string[] = [];
    catelogProductObject: CatelogProductMaster = {} as CatelogProductMaster;
    // catelogProductAgreementObject: ProductAgreement = {} as ProductAgreement;
    productCategoryObject: ProductCategory = {} as ProductCategory;
    selectedProductCategory: ProductCategory = {} as ProductCategory;
    productCategoryDropdownList: ProductCategory[] = [];
    createPackageObject: CreatePackage = {} as CreatePackage;
    getEditPackageUuid: CreatePackage = {} as CreatePackage;
    selectedCreatePackage: CreatePackage = {} as CreatePackage;
    savePackageObj: CreatePackage = {} as CreatePackage;
    createPackageList: CreatePackage[] = [];
    createPackageListForSave: CreatePackage[] = [];
    SparePartObject: SparePart = {} as SparePart;
    selectedSparePart: any[] = [];
    selectedSparePartList: SparePart[] = [];
    SparePartList: SparePart[] = [];
    productList: string[] = [];
    selectedUuid: string[];
    SparePartDropdown: string[] = [];
    selectedFiles: any[] = [];
    selectedProductFile: { name: string; objectURL: SafeResourceUrl }[] = [];
    selectedWarrantyFile: { name: string; objectURL: SafeResourceUrl }[] = [];
    addProductDetailsForm: UntypedFormGroup;
    addCreatePackageFormWarranty: UntypedFormGroup;
    addCreatePackageFormAmc: UntypedFormGroup;
    addCreatePackageFormCamc: UntypedFormGroup;
    addCreatePackageFormDemand: UntypedFormGroup;
    addCreatePackageFormInstallation: UntypedFormGroup;
    addSparePartForm: UntypedFormGroup;
    catelogId: boolean = false;
    id: string;
    getProductUuid: any = {};
    showCreatePackage: boolean = false;
    is_already_signed: boolean = false;
    actionForEdit: boolean = false;
    actionForView: boolean = false;
    uploadedFiles: any[] = [];
    openDialogForCreatePackage: boolean = false;
    customerId: string;
    packageObj: Package = {} as Package;
    packageList: Package[] = [];
    selectedPackageForAdd: any;
    addProducts: any[] = [];
    addSparePartObject: SparePart = {} as SparePart;
    addSparePartList: SparePart[] = [];
    addproductList: string[] = [];
    addSparePartDropdown: string[] = [];
    predefinedMasterObject: PredefinedMaster = {} as PredefinedMaster;
    selectedmaintenance: PredefinedMaster = {} as PredefinedMaster;
    selectedPackage: PredefinedMaster = {} as PredefinedMaster;
    selectedProductOEM: PredefinedMaster = {} as PredefinedMaster;
    ProductOEMList: PredefinedMaster[] = [];

    packageTemp: any;
    constructor(
        public authService: AuthService,
        private productService: ProductService,
        private sweetAlertService: SweetAlertService,
        public router: Router,
        private route: ActivatedRoute,
        private predefinedService: PredefinedService,
        public productServicePackage: ProductServiceService
    ) {}

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get("id");
        this.setTableSetting();
        this.getProductCategoryList();
        this.getSparePartList();
        this.initializeSparePartData();
        this.getAddSparePartList();
        this.getServiceRequestStatus("MAINTENANCE-CYCLE");
        this.getServiceRequestStatus("PACKAGE-SERVICE-TYPE");
        this.getServiceRequestStatus("OEM");
        this.getPackageList();
        // this.editEventForPackage();
        // this.filterPackageList();
        // this.createPackageObject.package_document = {} as PackageDocument;
        this.productCategoryObject.ps_sops = {} as PsSop;
        // this.catelogProductObject.product_agreement = {} as ProductAgreement;

        this.route.queryParams.subscribe(() => {
            if (!this.id) {
                return;
            }

            this.route.queryParams.subscribe((queryParams) => {
                const action = queryParams["action"];
                console.log(action, "action");
                if (action === "edit") {
                    this.actionForEdit = true;
                } else if (action === "view") {
                    this.actionForView = true;
                }
            });

            this.productService.getPackageDetails(this.id).subscribe(
                (data: any) => {
                    this.catelogProductObject = data;

                    this.selectedProductCategory =
                        this.productCategoryDropdownList.find(
                            (item) =>
                                item.product_category ===
                                data.product_category.product_category
                        );

                    this.selectedSparePartList = data.spare_parts.map(
                        (part: any) => {
                            return this.SparePartList.find(
                                (item) =>
                                    item.spare_part_name ===
                                    part.spare_part_name
                            );
                        }
                    );

                    this.productCategoryObject.pss_string =
                        this.productCategoryObject.pss_string || "";
                    this.productCategoryObject.sops_string =
                        this.productCategoryObject.sops_string || "";

                    data.sop.forEach((value) => {
                        if (value.is_ps_sop === 2 && value.remarks) {
                            if (this.productCategoryObject.pss_string) {
                                this.productCategoryObject.pss_string += ", \n";
                            }
                            this.productCategoryObject.pss_string +=
                                value.remarks;
                        } else if (value.is_ps_sop === 1 && value.remarks) {
                            if (this.productCategoryObject.sops_string) {
                                this.productCategoryObject.sops_string +=
                                    ", \n";
                            }
                            this.productCategoryObject.sops_string +=
                                value.remarks;
                        }
                    });

                    this.selectedProductOEM = this.ProductOEMList.find(
                        (item) => item.uuid === data.oem.uuid
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
        });

        this.addProductDetailsForm = new UntypedFormGroup({
            selectedProductCategory: new UntypedFormControl("", [Validators.required]),
            sku: new UntypedFormControl("", Validators.required),
            // product_name: new FormControl("", [
            //     Validators.required,
            //     Validators.pattern(/^[a-zA-Z]*$/),
            // ]),
            // sap_oracle_code: new FormControl("", [
            //     Validators.required,
            //     Validators.pattern(/^[0-9]*$/),
            // ]),
            product_name: new UntypedFormControl("", Validators.required),
            sap_oracle_code: new UntypedFormControl("", Validators.required),
            approx_life: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^[0-9]*$/),
            ]),
            standard_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            selling_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            tax: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            selectedSparePartList: new UntypedFormControl("", [Validators.required]),
            repairChecklist: new UntypedFormControl(""),
            problemDiagnosis: new UntypedFormControl(""),
            selectedProductOEM: new UntypedFormControl("", [Validators.required]),
            description: new UntypedFormControl(""),
        });

        this.addCreatePackageFormWarranty = new UntypedFormGroup({
            warranty_Tat: new UntypedFormControl("", Validators.required),
            Warranty_coverage_details: new UntypedFormControl("", Validators.required),
            warranty_Tenure: new UntypedFormControl("", Validators.required),
            fileUploadeForm: new UntypedFormControl(""),
            Amc_standard_price: new UntypedFormControl(""),
            Amc_selling_price: new UntypedFormControl(""),
            tax: new UntypedFormControl(""),
        });

        this.addCreatePackageFormAmc = new UntypedFormGroup({
            amc_Tat: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^[0-9]*$/),
            ]),
            Amc_Tax: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            // Amc_Package_name: new FormControl("", [
            //     Validators.required,
            //     Validators.pattern(/^[a-zA-Z]*$/),
            // ]),
            Amc_Package_name: new UntypedFormControl("", Validators.required),
            Amc_Tenure: new UntypedFormControl("", Validators.required),
            Amc_Preventive_Maintenance: new UntypedFormControl("", [
                Validators.required,
            ]),
            Amc_standard_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Amc_selling_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Amc_coverage_details: new UntypedFormControl(""),
        });

        this.addCreatePackageFormCamc = new UntypedFormGroup({
            // Camc_Name: new FormControl("", [
            //     Validators.required,
            //     Validators.pattern(/^[a-zA-Z]*$/),
            // ]),
            Camc_Name: new UntypedFormControl("", Validators.required),

            Camc_Tat: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^[0-9]*$/),
            ]),
            Camc_Tax: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Camc_Tenure: new UntypedFormControl("", Validators.required),
            Camc_Preventive_Maintenance: new UntypedFormControl("", [
                Validators.required,
            ]),
            Camc_standard_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Camc_selling_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Camc_coverage_details: new UntypedFormControl(""),
        });

        this.addCreatePackageFormDemand = new UntypedFormGroup({
            OnDemand_standard_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            OnDemand_selling_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            OnDemand_Tax: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            OnDemand_TAT: new UntypedFormControl(""),
        });

        this.addCreatePackageFormInstallation = new UntypedFormGroup({
            Installation_standard_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Installation_selling_price: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Installation_Tax: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^\d+(\.\d{1,2})?$/),
            ]),
            Installation_TAT: new UntypedFormControl(""),
        });

        this.addSparePartForm = new UntypedFormGroup({
            selectedSparePart: new UntypedFormControl(null, [Validators.required]),
        });
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
            paginate: false,
            delete: false,
            edit: true,
            view: false,
            active: true,
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
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };
        this.tableColsEvent = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "service_type",
                subfield: "name",
                header: "Package Type",
                fieldType: "nestedData",
            },
            {
                field: "package_name",
                header: "Name",
                fieldType: "text",
            },
            {
                field: "tenure",
                header: "Tenure",
                fieldType: "text",
            },
            {
                field: "maintenance_cycle",
                subfield: "name",
                header: "Preventive Maintenance",
                fieldType: "nestedData",
            },
            {
                field: "standard_price",
                header: "Standard Price",
                fieldType: "text",
            },
            {
                field: "tax",
                header: "Tax (%)",
                fieldType: "text",
            },
            {
                field: "selling_price",
                header: "Selling Price (Excl. Taxes)",
                fieldType: "text",
            },
            {
                field: "turn_around_time",
                header: "Service Request TAT (in days)",
                fieldType: "text",
            },
            {
                field: "spare_part_covered",
                header: "Spare Part Added",
                fieldType: "text",
            },
            {
                field: "coverage_details",
                header: "Coverage Details",
                fieldType: "text",
            },
        ];
    }

    closeEventDialog() {
        this.openAddDialogModuleEventForSparePartCovered = false;
    }

    closeSparePartDialog() {
        this.openDialogForCreatePackage = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        // this.product.pageNumber = event.page;
        // this.product.pageSize = this.pageSize;
    }

    addEvent() {
        // this.titleEVent="Add Product";
        // this.product = new ProductMaster();
    }

    EditEvent($event) {
        // this.titleEVent="Update Product";
        // this.product = $event;
    }

    searchData($event) {
        // this.product.searchValue= $event;
        // this.getProductList();
    }

    deleteEvent(event) {}

    activeEntity($event) {}
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
        // this.getProductList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        // this.product = new ProductMaster();
        // this.getProductList();
        this.visibleSidebar = false;
    }

    handleButtonClickToOpenDialogueForSparePartCovered() {
        this.openAddDialogModuleEventForSparePartCovered = true;
        // this.createPackageObject;

        // this.selectedSparePart = this.addSparePartList.filter((part) =>
        //     this.createPackageObject.spare_part_covered.includes(
        //         part.spare_part_name
        //     )
        // );
    }

    uploadAgreement(event: UploadEvent) {
        this.selectedFiles = event.currentFiles;

        this.selectedProductFile = event.currentFiles.map((file) => {
            return {
                name: file.name,
                objectURL: URL.createObjectURL(file),
            };
        });
    }

    reselectFile(fileUploader: any) {
        this.selectedFiles = [];
        this.selectedProductFile = [];
        fileUploader.clear();
        console.log("File selection cleared, user can reselect now.");
    }

    onUpload(event: UploadEvent) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }
    uploadAgreementPackage(event: UploadEvent) {
        this.selectedFiles = event.currentFiles;
        this.selectedWarrantyFile = event.currentFiles.map((file) => {
            return {
                name: file.name,
                objectURL: URL.createObjectURL(file),
            };
        });
    }

    reselectFilePackage(fileUploader: any) {
        this.selectedFiles = [];
        this.selectedWarrantyFile = [];
        fileUploader.clear();
        console.log("File selection cleared, user can reselect now.");
    }

    viewPdf(pdfUrl: string) {
        window.open(pdfUrl, "_blank");
    }

    resetCatelogProductMaster() {
        this.catelogProductObject.description = "";
        this.catelogProductObject = {} as CatelogProductMaster;
        this.selectedProductCategory = {} as ProductCategory;
        this.selectedSparePartList = [];
        this.productCategoryObject.pss_string = "";
        this.productCategoryObject.sops_string = "";
        this.selectedProductOEM = {} as PredefinedMaster;
    }

    resetCreatePackageMaster() {
        this.savePackageObj = {} as CreatePackage;
    }

    showDropdown() {
        this.savePackageObj = {} as CreatePackage;
        this.showPackageDropdown = true;
        // this.addedPackages = [];
        // if (this.addedPackages.length === 0) {
        //     this.addedPackages.push({ selectedCategory: null });
        // }
    }

    editEventForPackage(createPackage: CreatePackage) {
        this.createPackageObject = createPackage;
        this.getEditPackageUuid.uuid = createPackage.uuid;
        this.openDialogForCreatePackage = true;
    }

    filterPackageList() {
        this.filteredPackageServiceListForWarranty = false;
        this.filteredPackageServiceListForAMC = false;
        this.filteredPackageServiceListForCAMC = false;
        this.filteredPackageServiceListForOnDemand = false;
        this.filteredPackageServiceListForInstallation = false;

        if (this.selectedPackage && this.selectedPackage.name) {
            switch (this.selectedPackage.code) {
                case "Warranty":
                    this.filteredPackageServiceListForWarranty = true;
                    this.savePackageObj.standard_price =
                        this.catelogProductObject.standard_price;
                    this.savePackageObj.selling_price =
                        this.catelogProductObject.selling_price;
                    this.savePackageObj.tax = this.catelogProductObject.tax;
                    break;
                case "AMC":
                    this.filteredPackageServiceListForAMC = true;
                    break;
                case "CAMC":
                    this.filteredPackageServiceListForCAMC = true;
                    break;
                case "On-Demand":
                    this.filteredPackageServiceListForOnDemand = true;
                    break;
                case "Installation Charges":
                    this.filteredPackageServiceListForInstallation = true;
                    break;
                default:
                    break;
            }
        } else {
            console.error("Selected package is invalid");
        }
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

    setProductCategoryList() {
        this.productCategoryObject.pss_string = "";
        if (Array.isArray(this.selectedProductCategory.sops)) {
            for (let sops of this.selectedProductCategory.sops) {
                if (sops) {
                    if (this.productCategoryObject.pss_string) {
                        this.productCategoryObject.pss_string += ", \n";
                    }
                    this.productCategoryObject.pss_string += sops;
                }
            }
        }

        this.productCategoryObject.sops_string = "";
        if (Array.isArray(this.selectedProductCategory.pss)) {
            for (let pss of this.selectedProductCategory.pss) {
                if (pss) {
                    if (this.productCategoryObject.sops_string) {
                        this.productCategoryObject.sops_string += ", \n";
                    }
                    this.productCategoryObject.sops_string += pss;
                }
            }
        }
    }

    saveCatelogProduct() {
        this.addProductDetailsForm.markAllAsTouched();
        if (!this.addProductDetailsForm.valid) {
            return;
        }
        this.addProductDetailsForm;
        // this.catelogProductObject = this.productCategoryObject.pss_string;
        //   this.catelogProductObject = this.productCategoryObject.sops_string;
        this.catelogProductObject.spare_parts_uuid = [];
        this.selectedSparePartList.forEach((cat: SparePart) => {
            this.catelogProductObject.spare_parts_uuid.push(cat.uuid);
        });
        this.catelogProductObject.product_category_uuid =
            this.selectedProductCategory.uuid;

        this.catelogProductObject.oem_uuid = this.selectedProductOEM.uuid;

        const fd = new FormData();
        fd.append("data", JSON.stringify(this.catelogProductObject));
        if (this.selectedFiles && this.selectedFiles[0]) {
            fd.append("product_agreement", this.selectedFiles[0]);
        }
        this.productService.saveCatelogProduct(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.showCreatePackage = true;
                this.getProductUuid = data;
                this.getAddSparePartList();
                this.addProductDetailsForm.reset();
            },
            (err) => {
                if (err?.error?.error) {
                    this.sweetAlertService.errorAlert(err.error.error);
                } else {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            }
        );
    }

    updateCatelogManager() {
        this.addProductDetailsForm.markAllAsTouched();
        if (!this.addProductDetailsForm.valid) {
            return;
        }
        this.addProductDetailsForm;
        this.catelogProductObject.spare_parts_uuid = [];
        this.selectedSparePartList.forEach((cat: SparePart) => {
            this.catelogProductObject.spare_parts_uuid.push(cat?.uuid);
        });
        this.catelogProductObject.product_category_uuid =
            this.selectedProductCategory.uuid;

        this.catelogProductObject.oem_uuid = this.selectedProductOEM.uuid;

        this.productCategoryObject.code = undefined;
        this.productCategoryObject.entity_type = undefined;
        this.productCategoryObject.product_category = undefined;
        this.productCategoryObject.name = undefined;
        this.productCategoryObject.ps_sops = undefined;
        this.productCategoryObject.pss = undefined;
        this.productCategoryObject.sops = undefined;
        this.catelogProductObject.warranty_available = undefined;
        this.catelogProductObject.is_active = undefined;
        this.catelogProductObject.is_delete = undefined;
        this.catelogProductObject.product_category = undefined;
        this.catelogProductObject.oem = undefined;
        this.catelogProductObject.spare_parts = undefined;
        this.catelogProductObject.sop = undefined;
        this.catelogProductObject.modified_by = undefined;
        this.catelogProductObject.created_by = undefined;
        this.catelogProductObject.modified_at = undefined;
        this.catelogProductObject.product_documents = undefined;
        this.catelogProductObject.created_at = undefined;
        this.catelogProductObject.product_name = undefined;

        const fd = new FormData();
        fd.append("data", JSON.stringify(this.catelogProductObject));
        if (this.selectedFiles && this.selectedFiles[0]) {
            fd.append("product_agreement", this.selectedFiles[0]);
        }
        this.productService
            .updateCatelogManager(this.catelogProductObject.uuid, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.router.navigate(["/panel/catelog-management"]);
                },

                (err) => {
                    if (err?.error?.error) {
                        this.sweetAlertService.errorAlert(err.error.error);
                    } else {
                        this.sweetAlertService.errorAlert(
                            "Something Went Wrong!"
                        );
                    }
                }
            );
    }

    addToCreatePackageItem() {
        this.addCreatePackageFormWarranty.markAllAsTouched();
        this.addCreatePackageFormAmc.markAllAsTouched();
        this.addCreatePackageFormCamc.markAllAsTouched();
        this.addCreatePackageFormDemand.markAllAsTouched();
        this.addCreatePackageFormInstallation.markAllAsTouched();

        if (!this.selectedPackage || !this.selectedPackage.name) {
            console.error("Selected package is invalid");
            return;
        }
        switch (this.selectedPackage.code) {
            case "Warranty":
                if (!this.addCreatePackageFormWarranty.valid) {
                    return;
                }
                break;
            case "AMC":
                if (!this.addCreatePackageFormAmc.valid) {
                    return;
                }
                break;
            case "CAMC":
                if (!this.addCreatePackageFormCamc.valid) {
                    return;
                }
                break;
            case "On-Demand":
                if (!this.addCreatePackageFormDemand.valid) {
                    return;
                }
                break;
            case "Installation Charges":
                if (!this.addCreatePackageFormInstallation.valid) {
                    return;
                }
                break;
            default:
                console.error("Unknown package name");
                return;
        }

        this.savePackageObj.service_type_uuid = this.selectedPackage?.uuid;
        this.savePackageObj.service_type = {} as any;
        this.savePackageObj.service_type.name = this.savePackageObj.name;
        this.savePackageObj.service_type.name = this.selectedPackage.name;
        this.savePackageObj.maintenance_cycle = {} as any;
        this.savePackageObj.maintenance_cycle.name = this.savePackageObj.name;

        this.savePackageObj.spare_parts_uuid = this.selectedSparePart.map(
            (part) => part.spare_part_name
        );
        this.savePackageObj.package_name = this.savePackageObj?.package_name;
        this.savePackageObj.tenure = this.savePackageObj?.tenure;
        this.savePackageObj.standard_price =
            this.savePackageObj?.standard_price;
        this.savePackageObj.spare_part = this.savePackageObj?.spare_part;
        this.savePackageObj.coverage_details =
            this.savePackageObj?.coverage_details;
        this.savePackageObj.package_document =
            this.savePackageObj?.package_document;
        this.createPackageList.push(
            JSON.parse(JSON.stringify(this.savePackageObj))
        );

        this.packageList.push(JSON.parse(JSON.stringify(this.savePackageObj)));

        this.addedPackages = [];
        this.saveSinglePackage();
        this.selectedPackage = {} as PredefinedMaster;
        this.filteredPackageServiceListForWarranty = false;
        this.filteredPackageServiceListForAMC = false;
        this.filteredPackageServiceListForCAMC = false;
        this.filteredPackageServiceListForOnDemand = false;
        this.filteredPackageServiceListForInstallation = false;
    }

    saveSinglePackage() {
        this.savePackageObj.product_uuid =
            this.id || this.getProductUuid?.product_uuid;
        this.savePackageObj.package_name = this.savePackageObj?.package_name;
        this.savePackageObj.tenure = this.savePackageObj?.tenure;
        this.savePackageObj.standard_price =
            this.savePackageObj?.standard_price;
        this.savePackageObj.selling_price = this.savePackageObj?.selling_price;
        this.savePackageObj.tax = this.savePackageObj?.tax;
        this.savePackageObj.coverage_details =
            this.savePackageObj?.coverage_details;
        this.savePackageObj.turn_around_time =
            this.savePackageObj?.turn_around_time;
        this.savePackageObj.remarks = this.savePackageObj?.remarks;
        this.savePackageObj.maintenance_cycle_uuid =
            this.selectedmaintenance.uuid;

        this.savePackageObj.spare_parts_uuid = this.selectedSparePart.map(
            (part) => part.uuid
        );

        this.savePackageObj.spare_part_covered = undefined;
        this.savePackageObj.maintenance_cycle = undefined;
        this.savePackageObj.service_type = undefined;
        this.savePackageObj.field1 = undefined;
        this.savePackageObj.field2 = undefined;
        this.savePackageObj.field3 = undefined;
        this.savePackageObj.is_delete = undefined;
        this.savePackageObj.url = undefined;
        this.savePackageObj.thumbnail = undefined;
        this.savePackageObj.code = undefined;
        this.savePackageObj.name = undefined;
        this.savePackageObj.entity_type = undefined;
        this.savePackageObj.is_active = undefined;
        this.savePackageObj.parent = undefined;
        this.savePackageObj.created_at = undefined;
        this.savePackageObj.modified_at = undefined;

        const fd = new FormData();
        fd.append("data", JSON.stringify(this.savePackageObj));
        if (this.selectedFiles && this.selectedFiles[0]) {
            fd.append("package_documents", this.selectedFiles[0]);
        }

        this.productService.saveCreatePackageUuidList(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.selectedSparePart = [];
                this.addProducts = [];
                this.packageTemp = data.data;
                this.showPackageDropdown = false;
                // this.router.navigateByUrl("/panel/catelog-management");
                this.getPackageList();
            },
            (err) => {
                this.sweetAlertService.errorAlert(`Something went wrong!`);
            }
        );
    }

    updateCreatePackageList() {
        if (this.packageList.length === 0) {
            return;
        }
        this.updateSinglePackage(0);
    }

    updateSinglePackage(index: number) {
        if (index >= this.packageList.length) {
            console.log("All items have been saved.");

            return;
        }

        this.createPackageObject.product_uuid = this.id;
        this.createPackageObject.package_name =
            this.createPackageObject?.package_name;
        this.createPackageObject.tenure = this.createPackageObject?.tenure;
        this.createPackageObject.standard_price =
            this.createPackageObject?.standard_price;
        this.createPackageObject.selling_price =
            this.createPackageObject?.selling_price;
        this.createPackageObject.tax = this.createPackageObject?.tax;
        this.createPackageObject.coverage_details =
            this.createPackageObject?.coverage_details;
        this.createPackageObject.turn_around_time =
            this.createPackageObject?.turn_around_time;
        this.createPackageObject.remarks = this.createPackageObject?.remarks;

        this.createPackageObject.spare_parts_uuid = this.selectedSparePart.map(
            (part) => part.uuid
        );

        this.createPackageObject.spare_part_covered = undefined;
        this.createPackageObject.maintenance_cycle = undefined;
        this.createPackageObject.service_type = undefined;
        this.createPackageObject.field1 = undefined;
        this.createPackageObject.field2 = undefined;
        this.createPackageObject.field3 = undefined;
        this.createPackageObject.is_delete = undefined;
        this.createPackageObject.url = undefined;
        this.createPackageObject.thumbnail = undefined;
        this.createPackageObject.code = undefined;
        this.createPackageObject.name = undefined;
        this.createPackageObject.entity_type = undefined;
        this.createPackageObject.is_active = undefined;
        this.createPackageObject.parent = undefined;
        this.createPackageObject.created_at = undefined;
        this.createPackageObject.modified_at = undefined;
        this.createPackageObject.uuid = undefined;

        const fd = new FormData();
        fd.append("data", JSON.stringify(this.createPackageObject));

        if (this.selectedFiles && this.selectedFiles[0]) {
            fd.append("package_documents", this.selectedFiles[0]);
        }
        this.productService
            .updateCreatePackageList(this.getEditPackageUuid.uuid, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.getPackageList();
                    this.openDialogForCreatePackage = false;
                },
                (err) => {
                    this.sweetAlertService.errorAlert(`Something Went Wrong!`);
                    this.openDialogForCreatePackage = false;
                }
            );
    }

    getSparePartList() {
        this.productService.getSparePartList(this.SparePartObject).subscribe(
            (data: any) => {
                this.SparePartList = data;

                console.log("spare Dropdown", this.SparePartList);
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getServiceRequestStatus(type: string) {
        this.predefinedMasterObject.entity_type = type;
        this.predefinedService
            .getServiceRequestStatus(this.predefinedMasterObject)
            .subscribe((data: any) => {
                switch (type) {
                    case "MAINTENANCE-CYCLE":
                        this.maintenanceList = data.data;
                        if (this.customerId) {
                            this.predefinedMasterObject =
                                this.maintenanceList.filter(
                                    (status: PredefinedMaster) =>
                                        status.name ===
                                        this.predefinedMasterObject.name
                                )[0];
                        }
                        break;
                    case "PACKAGE-SERVICE-TYPE":
                        this.packageServiceList = data.data;
                        if (this.customerId) {
                            this.predefinedMasterObject =
                                this.packageServiceList.filter(
                                    (status: PredefinedMaster) =>
                                        status.name ===
                                        this.predefinedMasterObject.name
                                )[0];
                        }
                        break;
                    case "OEM":
                        this.ProductOEMList = data.data;
                        break;

                    default:
                        break;
                }
            });
    }

    getPackageList() {
        this.packageObj.product_uuid = this.id;
        this.productServicePackage.getPackageList(this.packageObj).subscribe(
            (data: any) => {
                this.packageList = data;
                data.forEach((item: any) => {
                    if (
                        Array.isArray(item.spare_part_covered) &&
                        item.spare_part_covered.length === 0
                    ) {
                        item.spare_part_covered = "-";
                    }
                });
            },
            (err: any) => {
                console.error(err, "ERR");
            }
        );
    }

    getAddSparePartList() {
        this.productService
            .getAddSparePartList(this.id || this.getProductUuid?.product_uuid)
            .subscribe(
                (data: any) => {
                    this.addSparePartList = data;
                    this.initializeSparePartData();
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    initializeSparePartData(): void {
        if (this.selectedSparePart && this.selectedSparePart.length > 0) {
            this.addProducts = [];
            this.selectedSparePart.forEach((item: any) => {
                this.addProducts.push({
                    spare_part_type_name: item.spare_part_name || "",
                    sku: item.sku || "",
                    standard_price: item.standard_price || 0,
                    tax: item.tax || "",
                    uuid: item.uuid || "",
                });
            });
        }
    }

    onSparePartsSelect(): void {
        this.initializeSparePartData();
    }

    removeProduct(index: number): void {
        this.addProducts.splice(index, 1);
        this.selectedSparePart.splice(index, 1);
        this.selectedSparePart = [...this.selectedSparePart];
    }

    addNewSparePartRequest(): void {
        this.addSparePartForm.markAllAsTouched();
        if (
            !this.addSparePartForm.valid ||
            this.selectedSparePart.length === 0
        ) {
            return;
        }

        this.createPackageObject.spare_parts_uuid = this.selectedSparePart.map(
            (part) => part.uuid
        );

        this.openAddDialogModuleEventForSparePartCovered = false;
        this.sweetAlertService.successAlert("Data added successfully!");
    }

    deletePackageType(event) {
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
                let delCustomer = this.packageObj;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.productServicePackage
                    .deletePackageType(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Catelog Product successfully.",
                                "success"
                            );
                            this.getPackageList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Catelog Product successfully.",
                                        "success"
                                    );
                                    this.getPackageList();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactivePackageType(service: Package) {
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
                this.productServicePackage
                    .statusForPackageType(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Package Type " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getPackageList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Package Type " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getPackageList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    checkStandardAndSelling() {
        const standardPrice = Number(this.catelogProductObject.standard_price);
        const sellingPrice = Number(this.catelogProductObject.selling_price);
        if (sellingPrice < standardPrice) {
            this.sweetAlertService.errorAlert(
                "Selling Price cannot be less than Standard Price!"
            );

            this.catelogProductObject.selling_price = null;
        }
    }

    checkStandardAndSellingPackage() {
        const standardPrice = Number(this.savePackageObj.standard_price);
        const sellingPrice = Number(this.savePackageObj.selling_price);
        if (sellingPrice < standardPrice) {
            this.sweetAlertService.errorAlert(
                "Selling Price cannot be less than Standard Price!"
            );

            this.savePackageObj.selling_price = null;
        }
    }

    checkStandardAndSellingUpdate() {
        const standardPrice = Number(this.createPackageObject.standard_price);
        const sellingPrice = Number(this.createPackageObject.selling_price);
        if (sellingPrice < standardPrice) {
            this.sweetAlertService.errorAlert(
                "Selling Price cannot be less than Standard Price!"
            );

            this.createPackageObject.selling_price = null;
        }
    }
}
