import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Customer, CustomerProduct } from "src/app/demo/domain/customer";
import { Contract, ContractItem } from "src/app/model/Contract.model";
import { Package } from "src/app/model/Package.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { AuthService } from "src/app/service/auth.service";
import { CustomerService } from "src/app/service/customerservice";
import { PredefinedService } from "src/app/service/predefined.service";
import { ProductServiceService } from "src/app/service/product-service.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { objectValidator } from "../../custom-validator";

@Component({
    selector: "app-create-order-customer",
    templateUrl: "./create-order-customer.component.html",
    styleUrls: ["./create-order-customer.component.scss"],
})
export class CreateOrderCustomerComponent implements OnInit {
    tableColsEventOne: any[] = [];
    tableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    index: number = 0;
    openAddDialogModuleEvent: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 5;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    fileSave: any;
    dialogWidth = "620px";
    statusList: any[] = [];
    visibleSidebar: boolean = false;
    dummyDataOne: any[] = [];
    customerId: string;

    customers: Customer[];
    customer: Customer = {} as Customer;
    selectedCustomer: Customer = {} as Customer;
    package: Package = {} as Package;
    customerProduct: CustomerProduct = {} as CustomerProduct;
    customerProductList: CustomerProduct[];
    selectedCustomerProduct: CustomerProduct = {} as CustomerProduct;
    // selectedCustomerProduct: CustomerProduct = {
    //     product_serial_number: "",
    // } as CustomerProduct;
    seletedPackageService: any = {};
    selectedPackageServiceType: PredefinedMaster = new PredefinedMaster();
    packageServiceTypeList: Package[] = [];
    serviceList: PredefinedMaster;
    contractItem: ContractItem = {} as ContractItem;
    contractItemList: ContractItem[] = [];
    contract: Contract = {} as Contract;
    contractModel: ContractItem = {} as ContractItem;
    getProductSerialNumber: any = {};

    packageList: Package[] = [];
    selectedPackage: Package = { maintenance_cycle: { name: "" } } as Package;

    createOrderForm: FormGroup;
    productDisplay: any;
    type: any;
    packadeId: any;
    packageUUid: any;
    productTempUUid: any;
    showProductError: boolean = false;
    warrantyBillabeList = [
        {
            name: "Yes",
            value: true,
        },
        {
            name: "No",
            value: false,
        },
    ];
    selectedWarantyBillable = {} as any;
    hiddenFieldsForWarranty: any;
    constructor(
        private predefinedService: PredefinedService,
        private sweetAlertService: SweetAlertService,
        public authService: AuthService,
        public customerService: CustomerService,
        public activatedRoute: ActivatedRoute,
        public productService: ProductServiceService,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.setTableSetting();
        // this.getPredefinedByType("PACKAGE-SERVICE-TYPE");

        this.activatedRoute.paramMap.subscribe((url: any) => {
            this.customerId = url.params.id;
            this.getCustomerList();
        });

        this.createOrderForm = new FormGroup({
            // selectedCustomer: new FormControl("", [
            //     Validators.required,
            //     objectValidator(),
            // ]),
            // serial_no: new FormControl(""),
            selectedCustomerProduct: new FormControl("", [
                Validators.required,
                objectValidator(),
            ]),
            selectedPackageServiceType: new FormControl("", [
                Validators.required,
                objectValidator(),
            ]),

            tenure: new FormControl(""),
            tat: new FormControl(""),
        });
        console.log(this.selectedCustomerProduct, "selectedCustomerProduct");

        this.hiddenFieldsForWarranty = [
            "package_amount",
            "tax_percent",
            "itemwise_total_amount",
            "turn_around_time",

            "end_date",
        ];
    }
    setTableSetting() {
        console.log(this.tableColsEventOne, "vtableColsEventOne");
        this.searchPlaceholder = "Product Name";
        this.tableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: true,
            delete: true,
            edit: false,
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
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };

        this.tableColsEventOne = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "product_name",
                header: "Product Name",
                fieldType: "text",
            },
            {
                field: "serial_number",
                header: "Serial Number",
                fieldType: "text",
            },
            {
                field: "service_type",
                header: "Product/Service Type",
                fieldType: "text",
            },
            {
                field: "package_name",
                header: "Package Name",
                fieldType: "text",
            },
            {
                field: "selling_price",
                header: "Price",
                fieldType: "text",
            },
            { field: "tax_percent", header: "Tax %", fieldType: "text" },
            {
                field: "itemwise_total_amount",
                header: "Total",
                fieldType: "text",
            },
            {
                field: "turn_around_time",
                header: "TAT",
                fieldType: "text",
            },
            {
                field: "start_date",
                header: "Start Date",
                fieldType: "date",
            },
            {
                field: "end_date",
                header: "End Date",
                fieldType: "date",
            },
            {
                field: "other",
                header: "Other",
                fieldType: "button",
            },
            // {
            //     field: "remarks",
            //     header: "Remarks",
            //     fieldType: "text",
            // },
        ];
    }

    goBackToProductDetails() {
        this.router.navigate([`panel/add-client/${this.customerId}`], {
            queryParams: { tab: "product-details" },
        });
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        // this.product.pageNumber = event.page;
        // this.product.pageSize = this.pageSize;
    }

    addEvent() {
        // this.titleEVent="Add Product";
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
        this.openAddDialogModuleEvent = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    // getPredefinedByType(type: string) {
    //     let predefined = new PredefinedMaster();
    //     predefined.entity_type = type;
    //     this.predefinedService
    //         .getPredefinedByTypeAndCode(predefined)
    //         .subscribe((data: any) => {
    //             switch (type) {
    //                 case "PACKAGE-SERVICE-TYPE":
    //                     this.packageServiceTypeList = data.data;
    //                     break;

    //                 default:
    //                     break;
    //             }
    //         });
    // }

    searchFilter() {
        // this.getProductList();
        this.visibleSidebar = false;
    }
    resetFilter() {
        // this.product = new ProductMaster();
        // this.getProductList();
        this.visibleSidebar = false;
    }

    openViewModal(contract: ContractItem) {
        this.openAddDialogModuleEvent = true;
        // this.contractModel = contract;
        // console.log(this.contractModel,"this.contractModel")
        this.getpackageId(contract.package_uuid);
    }

    addYearToDate(date: Date, years: number) {
        const newDate = new Date(date); // Create a copy to avoid mutating the original
        newDate.setFullYear(newDate.getFullYear() + years); // Add the desired years
        return newDate;
    }

    deleteContractItem(contractItem: ContractItem) {
        this.contractItemList = this.contractItemList.filter(
            (item: ContractItem) => item !== contractItem
        );
    }

    getCustomerList() {
        this.customerService.getCustomerList(this.customer).subscribe(
            (data) => {
                this.customers = data;
                // if (this.customerId) {
                //     this.getCustomerProductList();
                //     this.selectedCustomer = this.customers.filter(
                //         (cust: Customer) => cust.uuid === this.customerId
                //     )[0];
                // }

                if (this.customerId) {
                    this.selectedCustomer = this.customers.filter(
                        (cust: Customer) => cust.uuid === this.customerId
                    )[0];
                    this.getCustomerProductList();
                }
            },
            (err) => {
                console.log(err, "ERR");

                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    getProductTypeList(product: any) {
        this.getProductSerialNumber.product_serial_number =
            product.value.product_serial_number;
        this.package.product_uuid = product.value.product_uuid;
        this.productTempUUid = product.value.product_uuid;
        this.productService.getPackageList(this.package).subscribe(
            (data) => {
                const uniqueServiceTypes = new Set(); // To track unique service types
                this.packageServiceTypeList = []; // Clear the list before populating

                data.forEach((element) => {
                    this.packadeId = element.uuid;
                    element.service_type.package_uuid = this.packadeId;

                    // if (
                    //     !uniqueServiceTypes.has(
                    //         element.service_type.name.toLowerCase()
                    //     )
                    // ) {
                    //     uniqueServiceTypes.add(
                    //         element.service_type.name.toLowerCase()
                    //     );
                    //     this.packageServiceTypeList.push(element.service_type);
                    // }

                    if (
                        !uniqueServiceTypes.has(
                            element.service_type.name.toLowerCase()
                        ) &&
                        element.service_type.name !== "On Demand"
                    ) {
                        uniqueServiceTypes.add(
                            element.service_type.name.toLowerCase()
                        );
                        this.packageServiceTypeList.push(element.service_type);
                    }
                    console.log(
                        this.packageServiceTypeList,
                        "Filtered Service Types"
                    );
                });
            },
            (err) => {
                console.log(err, "ERR");
                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    getPackageById(product: any) {
        this.package.product_uuid = product.value.product_uuid;
        this.productService.getPackageList(this.package).subscribe(
            (data) => {
                // this.packageServiceTypeList = data;
                data.forEach((element) => {
                    this.packageServiceTypeList.push(element.service_type);
                    console.log(element, "this.packageServiceTypeList");
                });
            },
            (err) => {
                console.log(err, "ERR");

                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }
    getCustomerProductList() {
        this.customerProduct.customer_uuid = this.selectedCustomer.uuid;
        this.customerProduct.per_page = 50;
        this.productService
            .getCustomerProductList(this.customerProduct)
            .subscribe(
                (data: any) => {
                    this.customerProductList = data;
                    this.customerProductList = this.customerProductList.map(
                        (product) => ({
                            ...product,
                            productDisplay: `${product.product_name} - ${product.location} - ${product.product_serial_number}`,
                        })
                    );
                    // this.selectedCustomerProduct = {} as CustomerProduct;
                    console.log(this.selectedCustomerProduct, "product");
                },
                (err: any) => {
                    console.error(err, "ERR");
                }
            );
    }

    getPackageLists(type) {
        console.log(type, "type");
        let packageObj = {} as Package;
        console.log(this.productTempUUid, "productTempUUid");
        console.log(this.type, "this.type");
        packageObj.page = 1;
        packageObj.per_page = 100;
        packageObj.product_uuid = this.productTempUUid;
        packageObj.service_type_uuid = type.uuid;

        this.productService.getPackageList(packageObj).subscribe(
            (data: any) => {
                this.packageList = data;

                console.log("Listttt", this.packageList);
            },
            (err: any) => {
                console.error(err, "ERR");
            }
        );
    }

    setSelectedServiceType(contractItem: ContractItem) {
        console.log(
            this.selectedPackageServiceType.code,
            "this.selectedPackageServiceType.code"
        );
        switch (this.selectedPackageServiceType.code) {
            case "AMC":
                contractItem.is_amc_camc = true;
                break;
            case "CAMC":
                contractItem.is_amc_camc_service = true;
                break;
            case "Warranty":
                contractItem.is_warrantry_service = true;
                break;
            case "On-Demand":
                contractItem.is_ondemand_service = true;
                break;
            case "Installation Charges":
                contractItem.is_insallation_charges_service = true;
                break;
        }
    }

    addToContractItem() {
        this.createOrderForm.markAllAsTouched();

        // Check form validity
        if (!this.createOrderForm.valid) {
            // this.showProductError = this.createOrderForm.get(
            //     "selectedCustomerProduct"
            // )?.invalid;
            return;
        }

        // Ensure the product has a valid UUID
        // if (!this.selectedCustomerProduct?.uuid?.trim()) {
        //     this.showProductError = true;
        //     return;
        // }
        // this.showProductError = false;

        console.log(this.selectedPackage, "selectedPackage");
        console.log(this.seletedPackageService, "seletedPackageService");
        const sellingPrice = +this.seletedPackageService?.selling_price || 0;
        const tax = +this.seletedPackageService?.tax || 0;

        this.contractItem.itemwise_total_amount =
            sellingPrice + (sellingPrice * tax) / 100;

        const taxAmount = (sellingPrice * tax) / 100;
        console.log(taxAmount, "TaxAmount");
        console.log(
            "Itemwise Total Amount:",
            this.contractItem.itemwise_total_amount
        );
        // Initialize contract item properties
        this.contractItem.package_uuid = this.seletedPackageService.uuid;
        this.contractItem.customer_product_uuid =
            this.selectedCustomerProduct.uuid;
        this.contractItem.package_amount =
            +this.seletedPackageService.selling_price;
        this.contractItem.customer_uuid =
            this.customerId ?? this.selectedCustomer.uuid;
        this.contractItem.product_uuid =
            this.selectedCustomerProduct.product_uuid;
        this.contractItem.start_date = new Date();
        this.contractItem.product_name =
            this.selectedCustomerProduct.product_name;
        this.contractItem.package_name = this.selectedPackage.package_name;
        this.contractItem.serial_number =
            this.selectedCustomerProduct?.product_serial_number;
        this.contractItem.tenure = this.selectedPackage?.tenure;
        this.contractItem.turn_around_time =
            this.seletedPackageService?.turn_around_time;
        this.contractItem.service_type = this.selectedPackageServiceType.name;
        this.contractItem.standard_price =
            this.seletedPackageService?.standard_price;
        this.contractItem.selling_price =
            this.seletedPackageService?.selling_price;
        this.contractItem.tax_percent = +this.seletedPackageService?.tax || 0;
        this.contractItem.tax_amount = taxAmount || 0;
        if (
            this.seletedPackageService?.service_type?.code ==
            "Installation Charges"
        ) {
            this.contractItem.is_insallation_charges_service = true;
        }
        if (this.seletedPackageService?.service_type?.code == "CAMC") {
            this.contractItem.is_amc_camc = true;
        }
        if (this.seletedPackageService?.service_type?.code == "AMC") {
            this.contractItem.is_amc_camc = true;
        }
        if (this.seletedPackageService?.service_type?.code == "On-Demand") {
            this.contractItem.is_ondemand_service = true;
        }
        if (this.seletedPackageService?.service_type?.code == "Warranty") {
            this.contractItem.is_warranty_service = true;
        }
        console.log(
            "Selling Price:",
            this.seletedPackageService?.selling_price
        );
        console.log("Tax:", this.seletedPackageService?.tax);

        // Calculate itemwise total amount

        // Calculate end_date
        const startDate = new Date(this.contractItem.start_date);
        if (!isNaN(startDate.getTime())) {
            const endDate = new Date(startDate);
            let turnAroundTime;
            if (this.contractItem.is_amc_camc) {
                turnAroundTime = +this.seletedPackageService?.tenure || 0;
                endDate.setFullYear(startDate.getFullYear() + turnAroundTime);
                this.contractItem.end_date = endDate;
            } else {
                turnAroundTime =
                    +this.seletedPackageService?.turn_around_time || 0;
                endDate.setDate(startDate.getDate() + turnAroundTime);
                this.contractItem.end_date = endDate;
            }
        } else {
            console.error("Invalid start_date format");
        }

        console.log(this.contractItem.end_date, "product.end_date");

        // Add to contract item list
        this.contractItemList.push({ ...this.contractItem });
        console.log(this.contractItemList, "contractItem");
        // Reset properties
        this.contractItem = {} as ContractItem;
        this.selectedCustomerProduct = {} as CustomerProduct;
        this.selectedPackage = { maintenance_cycle: { name: "" } } as Package;
        this.selectedPackageServiceType = new PredefinedMaster();
        this.getProductSerialNumber = {};

        this.createOrderForm.reset();

        this.sweetAlertService.successAlert("Item Added!");
        console.log(this.contractItemList, "Contract item list");
    }

    createContract() {
        // this.createOrderForm.markAllAsTouched();
        // if (!this.createOrderForm.valid) {
        //     return;
        // }
        this.contract.customer_uuid = this.selectedCustomer.uuid;
        this.contract.contract_itemwise = this.contractItemList;
        console.log(this.type?.value?.code, "this.type?.value?.code=");
        console.log(this.seletedPackageService, "asd");

        this.customerService
            .createCustomerContract(this.contract)
            .subscribe((data: any) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.router.navigate(["/panel/add-client/" + this.customerId], {
                    queryParams: { tab: "contract" },
                });
            });
    }
    getServiceType(type: any) {
        console.log(
            this.selectedPackageServiceType,
            "selectedPackageServiceType"
        );
        console.log(type, "type");
        this.type = type.value;
        this.packageUUid = this.selectedPackageServiceType.package_uuid;
        this.getpackageId(this.packageUUid);

        this.getPackageLists(this.type);
        // if (this.type.name === "Warranty") {
        //     this.tableColsEventOne = this.tableColsEventOne.filter(
        //       col => !this.hiddenFieldsForWarranty.includes(col.field)
        //     );
        //     console.log(this.tableColsEventOne,"cas")
        //     this.setTableSetting();
        //   }
    }

    getpackageId(product: any) {
        this.productService.getpackageById(product).subscribe(
            (data) => {
                // this.packageServiceTypeList = data;
                this.seletedPackageService = data;
                console.log(
                    this.seletedPackageService,
                    "seletedPackageService"
                );
            },
            (err) => {
                console.log(err, "ERR");

                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }
}
