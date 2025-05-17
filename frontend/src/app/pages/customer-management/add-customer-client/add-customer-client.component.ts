import { Address } from "./../../../domain/customer";
import { DatePipe, formatDate } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Route, Router } from "@angular/router";
import {
    Customer,
    CustomerCategory,
    CustomerProduct,
} from "src/app/demo/domain/customer";
import {
    Contract,
    ContractItem,
    UploadEvent,
} from "src/app/model/Contract.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { Product, ProductCategory } from "src/app/model/Product";
import {
    Addresses,
    ServiceRequestMaster,
} from "src/app/model/ServiceRequest.model";
import { AuthService } from "src/app/service/auth.service";
import { CustomerService } from "src/app/service/customerservice";
import { PredefinedService } from "src/app/service/predefined.service";
import { ProductServiceService } from "src/app/service/product-service.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import Swal from "sweetalert2";
import { objectValidator } from "../../custom-validator";
import { OrderDetails } from "src/app/service/orderDetails.service";
import { OrderDetailsMaster } from "src/app/model/OrderDetails.model";
import { LegalEntityService } from "src/app/service/legalEntity.service";
import { LegalBranch, LegalEntity } from "src/app/model/LegalEntity.model";
import { SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "app-add-customer-client",
    templateUrl: "./add-customer-client.component.html",
    styleUrls: ["./add-customer-client.component.scss"],
    providers: [DatePipe],
})
export class AddCustomerClientComponent implements OnInit {
    customerId: string;
    customer: Customer = {} as Customer;
    customerTypeList: CustomerCategory[] = [];
    predefineType: PredefinedMaster = {} as PredefinedMaster;
    selectedCustomerType: CustomerCategory = {} as CustomerCategory;
    customerTypeObj: CustomerCategory = {} as CustomerCategory;
    selectedParentGroup: PredefinedMaster = {} as PredefinedMaster;
    filteredCustomerTypeList: any[] = [];
    zoneList: PredefinedMaster[] = [];
    selectedZone: PredefinedMaster = new PredefinedMaster();
    updateSelectedZone: PredefinedMaster = new PredefinedMaster();
    cityTypeList: PredefinedMaster[] = [];
    selectedCityType: PredefinedMaster = new PredefinedMaster();
    updateSelectedCityType: PredefinedMaster = new PredefinedMaster();
    cityList: PredefinedMaster[] = [];
    selectedCity: Address = {} as Address;
    selectedCityPre: PredefinedMaster = new PredefinedMaster();
    updateSelectedCity: PredefinedMaster = new PredefinedMaster();
    selectedBillingCityPre: PredefinedMaster = new PredefinedMaster();
    categoryList: ProductCategory[] = [];
    selectedCategory: ProductCategory = new ProductCategory();
    stateList: PredefinedMaster[] = [];
    selectedState: PredefinedMaster = {} as PredefinedMaster;
    updateSelectedState: PredefinedMaster = {} as PredefinedMaster;
    serviceStatusList: PredefinedMaster[] = [];
    parentGroupList: PredefinedMaster[] = [];
    selectedServiceStatus: PredefinedMaster = {} as PredefinedMaster;
    selectedBillingState: PredefinedMaster = {} as PredefinedMaster;
    splitPaymentList: PredefinedMaster[] = [];
    selectedSplitPayment: PredefinedMaster = {} as PredefinedMaster;
    contractStatusList: PredefinedMaster[] = [];
    selectedContractStatus: PredefinedMaster = {} as PredefinedMaster;
    minDate: Date;
    address1: string;
    address2: string;
    pincodeType: string;
    spoc_name: string;
    spoc_email: string;
    is_already_signed: boolean = false;
    if_signed: boolean = false;
    selectedFiles: any[] = [];
    selectedContractFile: { name: string; objectURL: SafeResourceUrl }[] = [];
    selectedDocument: any[] = [];
    isStateSelected: boolean = false;

    productList: Product[];
    product: Product = {} as Product;
    selectedProduct: Product = {} as Product;
    updatedSelectedProduct: Product = {} as Product;

    activeIndex: number = 0;

    customerProduct: CustomerProduct = {} as CustomerProduct;
    updateCustomerProductObj: CustomerProduct = {} as CustomerProduct;
    customerProductList: CustomerProduct[];
    uuidCustomerProduct: CustomerProduct = {} as CustomerProduct;
    selectedDate: Date;
    updatedSelectedDate: Date;
    selectedContractDate: Date;

    contract: Contract = {} as Contract;
    contractList: Contract[] = [];

    isShowAddressUpdate: boolean = false;
    isShowProductDetails: boolean = false;
    isShowContractDiscount: boolean = false;
    isShowInvoiceDetail: boolean = false;

    contractItemList: ContractItem[] = [];
    contractItem: ContractItem = {} as ContractItem;
    deleteContractItem: ContractItem = {} as ContractItem;

    tableColsEventOne: any[] = [];
    tableColsEventTwo: any[] = [];
    tableColsEventThree: any[] = [];
    tableColsContract: any[] = [];
    tableColsEventFour: any[] = [];
    tableColsEventFive: any[] = [];
    tableSettingsEvent: any = {};
    contractTableSettingsEvent: any = {};
    serviceTableSettingsEvent: any = {};
    invoiceTableSettingsEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    openAddDialogModuleEvent: boolean = false;
    hideButtonView: boolean = false;
    pageSize: number = 5;
    searchPlaceholder: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    msg: any;
    contractBeingEdited: ContractItem | null = null;
    fileSave: any;
    dialogWidth = "650px";
    dialogWidthForInvoice = "700px";
    statusList: any[] = [];
    visibleSidebar: boolean = false;
    dummyDataOne: any[] = [];
    dummyDataTwo: any[] = [];
    dummyDataThree: any[] = [];
    dummyDataFour: any[] = [];
    address: Address = {} as Address;
    updatedAddress: Address = {} as Address;
    isContractEdit: boolean = false;
    imageUrl: string | ArrayBuffer | null = null;
    serviceRequestList: ServiceRequestMaster[] = [];
    serviceRequest: ServiceRequestMaster = {} as ServiceRequestMaster;
    predefined: PredefinedMaster = {
        page_size: 10000,
    } as PredefinedMaster;

    addCustomerForm: UntypedFormGroup;
    addAddressForm: UntypedFormGroup;
    updateAddressForm: UntypedFormGroup;
    addProductForm: UntypedFormGroup;
    updateProductForm: UntypedFormGroup;
    contractUpdateForm: UntypedFormGroup;
    productCategory: ProductCategory = new ProductCategory();
    showView: any;
    oredrDetailsObject: OrderDetailsMaster = {} as OrderDetailsMaster;
    customerInvoiceList: OrderDetailsMaster = {} as OrderDetailsMaster;
    invoiceDetails: OrderDetailsMaster = {} as OrderDetailsMaster;
    addressDisplay: any;
    locationList: any[] = [];
    legalEntityObject: LegalEntity = {} as LegalEntity;
    legalBranchObject: LegalBranch = {} as LegalBranch;
    legalEntityList: LegalEntity[] = [];
    legalBranchList: LegalBranch[] = [];
    selectedLegalEntity: LegalEntity = {} as LegalEntity;
    selectedLegalBranch: LegalBranch = {} as LegalBranch;
    disableLegalEntity: boolean = false;
    disableLegalBranch: boolean = false;
    selectedPersonalFile: { name: string; objectURL: SafeResourceUrl }[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private customerService: CustomerService,
        private productService: ProductServiceService,
        private predefinedService: PredefinedService,
        private sweetAlertService: SweetAlertService,
        public authService: AuthService,
        public router: Router,
        private datePipe: DatePipe,
        public orderDetails: OrderDetails,
        private legalEntityService: LegalEntityService
    ) {}

    ngOnInit(): void {
        this.showView = this.authService.getViewSession();
        console.log(this.showView, "showview");
        console.log(this.selectedFiles, "selectedFiles");
        this.minDate = new Date();
        this.setTableSetting();

        this.addCustomerForm = new UntypedFormGroup({
            name: new UntypedFormControl("", Validators.required),
            email: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                ),
            ]),
            phone: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(/^[6789]\d{9}$/),
            ]),
            uuid: new UntypedFormControl(""),
            parent: new UntypedFormControl(""),
            type: new UntypedFormControl("", Validators.required),
            // kyc_no: new FormControl(""),
            kyc_no: new UntypedFormControl(""),
            selectedContractStatus: new UntypedFormControl(""),
        });
        this.addAddressForm = new UntypedFormGroup({
            address1: new UntypedFormControl("", Validators.required),
            state: new UntypedFormControl("", Validators.required),
            cityType: new UntypedFormControl("", Validators.required),
            city: new UntypedFormControl("", Validators.required),
            zone: new UntypedFormControl(""),
            pincodeType: new UntypedFormControl("", Validators.required),
            spoc_name: new UntypedFormControl("", Validators.required),
            spoc_email: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
                ),
            ]),
            phone: new UntypedFormControl(""),
            address2: new UntypedFormControl(""),
        });
        this.contractUpdateForm = new UntypedFormGroup({
            legalEntity: new UntypedFormControl(""),
            legalBranch: new UntypedFormControl(""),
            contract_Date: new UntypedFormControl("", Validators.required),
            remarks: new UntypedFormControl(""),
            splitPayment: new UntypedFormControl("", Validators.required),
            invoices: new UntypedFormControl("", Validators.required),
            paymentTerms: new UntypedFormControl("", [
                Validators.required,
                Validators.pattern("^[0-9]*$"), // Accepts only numbers
            ]),
            billingAddress: new UntypedFormControl("", Validators.required),
            billingCity: new UntypedFormControl("", Validators.required),
            billingState: new UntypedFormControl("", Validators.required),
            billingPincode: new UntypedFormControl("", Validators.required),
            gst: new UntypedFormControl("", [
                Validators.pattern(
                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/
                ),
            ]),
            terms: new UntypedFormControl("", Validators.required),
            is_checkBox: new UntypedFormControl(""),
        });

        this.updateAddressForm = new UntypedFormGroup({
            address1: new UntypedFormControl("", Validators.required),
            address2: new UntypedFormControl(""),
            state: new UntypedFormControl("", Validators.required),
            cityType: new UntypedFormControl("", Validators.required),
            city: new UntypedFormControl("", Validators.required),
            zone: new UntypedFormControl(""),
            pincodeType: new UntypedFormControl("", Validators.required),
            spoc_name: new UntypedFormControl("", Validators.required),
            spoc_email: new UntypedFormControl("", [
                Validators.required,
                Validators.email,
            ]),
            phone: new UntypedFormControl(""),
        });

        this.setProductFormProperties();

        this.updateProductForm = new UntypedFormGroup({
            location: new UntypedFormControl("", Validators.required),
            category: new UntypedFormControl("", Validators.required),
            name: new UntypedFormControl("", Validators.required),
            serial_no: new UntypedFormControl("", Validators.required),
            approx_life: new UntypedFormControl("", Validators.required),
            sku: new UntypedFormControl("", Validators.required),
            sap_code: new UntypedFormControl(""),
            start_date: new UntypedFormControl("", Validators.required),
        });
        this.activatedRoute.paramMap.subscribe((url: any) => {
            this.customerId = url.params.id;
            this.getCustomerById();
        });

        // this.getCustomerCategory();
        this.getPredefinedByType("ZONE");
        this.getPredefinedByType("CITY-TYPE");
        // this.getPredefinedByType("CITY");
        this.getPredefinedByType("STATE");
        this.getPredefinedByType("PAYMENT-FREQUENCY");
        this.getPredefinedByType("CUSTOMER-CONTRACT-STATUS");
        this.getPredefinedByType("SERVICE-REQUEST-STATUS");
        this.getPredefinedByType("PARENT-GROUP");
        this.getProductCategoryList();
        this.getCustomerCategory();
        this.getLegalEntityList();
        this.getLegalBranchList();

        console.log(this.customer, "customer");

        this.activatedRoute.queryParams.subscribe((queryParams: any) => {
            if (queryParams?.tab && queryParams?.tab === "contract") {
                this.activeIndex = 2;
            }
        });

        this.activatedRoute.queryParams.subscribe((queryParams: any) => {
            if (queryParams?.tab && queryParams?.tab === "product-details") {
                this.activeIndex = 1;
            }
        });

        this.activatedRoute.queryParams.subscribe((query: any) => {
            if (query?.tab && query?.tab == "contract") {
                this.activeIndex = 2;
            }
        });

        this.getCustomerContractList();
        this.getProductList();
        console.log(this.customer.addresses, "customer.addresses");
        console.log(this.customerId, "customerId");
        // this.getStatusList();
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
        this.contractTableSettingsEvent = {
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
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };
        this.serviceTableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: false,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: true,
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
            addOrderDetailsSparePart: false,
            addOrderDetailsOnDemand: false,
        };

        this.invoiceTableSettingsEvent = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: false,
            view: true,
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
            // { field: 'id', header: 'ID', fieldType: "text" },
            { field: "spoc_email", header: "Mail id", fieldType: "text" },
            {
                field: "spoc_phone",
                header: "Mobile Number",
                fieldType: "text",
            },
            {
                field: "state",
                header: "State",
                fieldType: "text",
            },
            { field: "city_type", header: "City Type", fieldType: "text" },
            {
                field: "city",
                header: "City",
                fieldType: "text",
            },
            { field: "zone", header: "Zone", fieldType: "text" },
            {
                field: "pincode",
                header: "Pincode",
                fieldType: "text",
            },
            {
                field: "spoc_name",
                header: "SPOC Person",
                fieldType: "text",
            },
            {
                field: "address_1",
                header: "Address 1",
                fieldType: "text",
            },
            {
                field: "address_2",
                header: "Address 2",
                fieldType: "text",
            },
        ];

        this.tableColsEventTwo = [
            // { field: 'id', header: 'ID', fieldType: "text" },
            {
                field: "location",
                header: "Location",
                fieldType: "text",
            },
            {
                field: "product_category",
                header: " Product Category",
                fieldType: "text",
            },
            {
                field: "product_name",
                header: "Product Name",
                fieldType: "text",
            },
            {
                field: "product_serial_number",
                header: "Product Serial Number",
                fieldType: "text",
            },
            {
                field: "approx_life",
                header: "Approx Life",
                fieldType: "text",
            },
            {
                field: "start_date_for_life",
                header: "Approx Life Start date",
                fieldType: "date",
            },
            {
                field: "end_date",
                header: "End Date",
                fieldType: "date",
            },

            {
                field: "sap_oracle_code",
                header: "SAP Oracle Code",
                fieldType: "text",
            },
        ];

        this.tableColsEventThree = [
            {
                field: "product_name",
                header: "Product Name",
                fieldType: "text",
            },
            {
                field: "serial_no",
                header: " Serial Number",
                fieldType: "text",
            },
            {
                field: "service_type",
                header: "Product/Service Type",
                fieldType: "text",
            },
            { field: "start_date", header: "Start Date", fieldType: "text" },
            {
                field: "end_date",
                header: "End Date",
                fieldType: "text",
            },
            { field: "price", header: "Price", fieldType: "text" },
            {
                field: "discount",
                header: "Discount",
                fieldType: "text",
            },
            {
                field: "tax",
                header: "Tax",
                fieldType: "text",
            },
            {
                field: "total",
                header: "Total",
                fieldType: "text",
            },
        ];

        this.tableColsContract = [
            {
                field: "contract_no",
                header: "Contract No",
                fieldType: "text",
            },
            {
                field: "contract_date",
                header: "Contract Date",
                fieldType: "date",
            },
            {
                field: "contract_amount",
                header: "Contract Amount",
                fieldType: "text",
            },
            {
                field: "contract_status",
                header: "Contract Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventFive = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "service_date",
                header: "Service Date",
                fieldType: "date",
            },
            {
                field: "account_name",
                header: "Client Name",
                fieldType: "text",
            },
            {
                field: "location",
                header: "Location",
                fieldType: "text",
            },
            {
                field: "service_person",
                header: "Service Person",
                fieldType: "text",
            },
            {
                field: "service_type",
                header: "Service Type",
                fieldType: "text",
            },
            {
                field: "package_name",
                header: "Package",
                fieldType: "text",
            },
            {
                field: "product_name",
                header: "Product name",
                fieldType: "text",
            },
            {
                field: "turn_around_time",
                header: "TAT",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventFour = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "customer_invoice_id",
                header: "Invoice No",
                fieldType: "text",
            },
            {
                field: "invoice_date",
                header: "Invoice Date",
                fieldType: "date",
            },
            {
                field: "account_name",
                header: "Account Name",
                fieldType: "text",
            },
            {
                field: "package",
                header: "Package",
                fieldType: "text",
            },
            {
                field: "total_payable",
                header: "Payable Amount",
                fieldType: "text",
            },
            {
                field: "customer_contract_id",
                header: "Contract No",
                fieldType: "text",
            },
            {
                field: "invoice_status",
                header: "Invoice Status",
                fieldType: "text",
            },
        ];
    }

    closeEventDialog() {
        this.openAddDialogModuleEvent = false;
    }

    paginateEvent(event) {
        this.pageSize = event.rows;
        // this.product.pageNumber = event.page;
        // this.product.pageSize = this.pageSize;
    }

    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    editproductDetails(customerProduct: CustomerProduct) {
        this.isShowProductDetails = true;
        this.customerProduct = customerProduct;
        this.updateCustomerProductObj.serial_no =
            this.customerProduct.product_serial_number;
        this.updateCustomerProductObj.sap_oracle_code =
            this.customerProduct.sap_oracle_code;
        this.updatedSelectedDate = this.customerProduct.start_date_for_life
            ? new Date(this.customerProduct.start_date_for_life)
            : null; // if(this.updatedSelectedProduct.approx_life==null || this.updatedSelectedProduct.approx_life==undefined || this.updatedSelectedProduct.approx_life==""){
        //     this.updatedSelectedProduct.approx_life =""
        // }
        this.updateCustomerProductObj.approx_life =
            this.customerProduct.approx_life;
        this.updateCustomerProductObj.sku = this.customerProduct.sku;
        console.log(this.customerProduct, "    this.customerProduct ");
        // this.customerProduct.start_date_for_life = this.datePipe.transform(
        //     this.updatedSelectedDate,
        //     "yyyy-MM-dd"
        // );

        this.updatedSelectedProduct = this.productList.find(
            (prod: Product) => prod.uuid === this.customerProduct.product_uuid
        ) as Product;

        this.selectedCategory = this.categoryList.filter(
            (category: ProductCategory) =>
                category.product_category ==
                this.customerProduct.product_category
        )[0];

        this.selectedCity = this.customer.addresses.filter(
            (address: Address) => address.city == this.customerProduct.location
        )[0];
    }

    closeProductDetails() {
        this.isShowProductDetails = false;
    }

    closeContractDiscount() {
        this.isShowContractDiscount = false;
    }

    closeInvoiceDetail() {
        this.isShowInvoiceDetail = false;
    }

    hideProductModal() {
        this.isShowProductDetails = false;
    }

    viewInvoiceDetail(invoiceDetailObject: OrderDetailsMaster) {
        this.invoiceDetails = invoiceDetailObject;
        this.isShowInvoiceDetail = true;
    }

    editContractDiscount(contract: ContractItem) {
        this.contractBeingEdited = contract;
        this.isShowContractDiscount = true;
        console.log(this.contractBeingEdited, "edit");
    }

    resetFilds() {
        this.customer = {} as Customer;
        this.address = {} as Address;
        this.selectedState = {} as PredefinedMaster;
        this.selectedCityType = {} as PredefinedMaster;
        this.selectedCityPre = {} as PredefinedMaster;
        this.selectedZone = {} as PredefinedMaster;
        this.selectedCustomerType = {} as CustomerCategory;
        this.selectedDocument = null;
    }

    restProductDetail() {
        this.customerProduct = {} as CustomerProduct;
        // this.customer = {} as Customer;
        this.selectedCategory = {} as ProductCategory;
        this.selectedProduct = {} as Product;
        this.selectedCity = {} as Address;
        this.selectedDate = null;
    }

    hideContractModal() {
        this.isShowContractDiscount = false;
    }

    deactiveEntity($event) {}

    saveEventDialog() {
        this.openAddDialogModuleEvent = false;
        // this.product = new ProductMaster();
        // this.getProductList();
    }

    logProduct() {
        console.log(this.selectedProduct, "Product");
    }

    searchFilter() {
        // this.getProductList();
        this.visibleSidebar = false;
    }

    setProductFormProperties() {
        this.addProductForm = new UntypedFormGroup({
            location: new UntypedFormControl("", objectValidator()),
            category: new UntypedFormControl("", objectValidator()),
            name: new UntypedFormControl("", Validators.required),
            serial_no: new UntypedFormControl("", Validators.required),
            approx_life: new UntypedFormControl(""),
            sku: new UntypedFormControl(""),
            sap_code: new UntypedFormControl(""),
            start_date: new UntypedFormControl("", Validators.required),
        });
    }

    resetFilter() {
        // this.product = new ProductMaster();
        // this.getProductList();
        this.visibleSidebar = false;
    }

    getCustomerById() {
        if (!this.customerId) {
            return;
        }

        this.customerService.getCustomerById(this.customerId).subscribe(
            (data: any) => {
                this.customer = data;

                this.selectedCustomerType = this.customerTypeList.find(
                    (customerType) =>
                        customerType.customer_type ===
                        this.customer.customer_type
                );

                this.getOrderDetailsList();
                this.customer.addresses = this.customer.addresses.map(
                    (address) => ({
                        ...address,
                        addressDisplay: `${address.city} - ${address.address_1}`,
                    })
                );
                console.log(this.addressDisplay, "addressDisplay");

                // if (
                //     this.customer?.addresses[0] != null &&
                //     this.customer?.addresses[0] != undefined
                // ) {
                //     this.address = this.customer?.addresses[0];
                // }

                // this.customer.addresses.forEach(element => {
                //     if(element.product_name == this.customerProduct.)
                // });

                console.log(this.customer, "this.customerthis.customer");
                // this.getCustomerCategory();
                this.getPredefinedByType("ZONE");
                this.getPredefinedByType("CITY-TYPE");
                this.getPredefinedByType("PAYMENT-FREQUENCY");
                this.getPredefinedByType("CUSTOMER-CONTRACT-STATUS");
                this.getPredefinedByType("SERVICE-REQUEST-STATUS");
                this.getPredefinedByType("CITY");
                this.getPredefinedByType("STATE");
                this.getPredefinedByType("PARENT-GROUP");

                this.getProductCategoryList();
                this.getCustomerProductList();
                this.serviceRequest.customer_uuid = this.customer.uuid;
                this.getServiceRequestListData(this.serviceRequest);

                console.log(this.customer, "Customer");
            },
            (err) => {
                console.log(err, "ERR");
            }
        );
    }

    getPredefinedByType(type: string) {
        // let predefined = new PredefinedMaster();
        this.predefined.entity_type = type;
        this.predefined.alphabeticOrder = true;
        this.predefinedService
            .getPredefinedByTypeAndCode(this.predefined)
            .subscribe((data: any) => {
                switch (type) {
                    case "ZONE":
                        this.zoneList = data.data;
                        if (this.customerId) {
                            this.selectedZone = this.zoneList.filter(
                                (zone: PredefinedMaster) =>
                                    zone.name === this.address.zone
                            )[0];
                        }
                        break;
                    case "CITY-TYPE":
                        this.cityTypeList = data.data;
                        if (this.customerId) {
                            this.selectedCityType = this.cityTypeList.filter(
                                (cityType: PredefinedMaster) =>
                                    cityType.name === this.address.city_type
                            )[0];
                        }
                        break;
                    case "PAYMENT-FREQUENCY":
                        this.splitPaymentList = data.data;
                        if (this.customerId) {
                            this.selectedSplitPayment =
                                this.splitPaymentList.filter(
                                    (splitPayment: PredefinedMaster) =>
                                        splitPayment.uuid ===
                                        this.contract.payment_frequency_uuid
                                )[0];
                        }
                        break;
                    // case "PRODUCT-CATEGORY":
                    //     if (this.customerId) {
                    //         this.selectedCategory = this.categoryList.filter(
                    //             (cityType: PredefinedMaster) =>
                    //                 cityType.name === this.address.city_type
                    //         )[0];
                    //     }
                    //     break;
                    case "CITY":
                        this.cityList = data.data;
                        if (this.customerId) {
                            this.selectedCityPre = this.cityList.filter(
                                (city: PredefinedMaster) =>
                                    city.name === this.address.city
                            )[0];
                        }
                        break;

                    case "STATE":
                        this.stateList = data.data;
                        if (this.customerId) {
                            this.selectedState = this.stateList.filter(
                                (state: PredefinedMaster) =>
                                    state.name === this.address.state
                            )[0];
                        }
                        break;
                    case "CUSTOMER-CONTRACT-STATUS":
                        this.contractStatusList = data.data;
                        if (this.customerId) {
                            this.selectedContractStatus =
                                this.contractStatusList.filter(
                                    (status: PredefinedMaster) =>
                                        status.name ===
                                        this.customer.status_uuid
                                )[0];
                        }
                        break;
                    case "SERVICE-REQUEST-STATUS":
                        this.serviceStatusList = data.data;
                        break;
                    case "PARENT-GROUP":
                        this.parentGroupList = data.data;
                        if (this.customerId) {
                            this.selectedParentGroup =
                                this.parentGroupList.filter(
                                    (parentGroup: PredefinedMaster) =>
                                        parentGroup.name ===
                                        this.customer.parent_group
                                )[0];
                        }
                        break;

                    default:
                        break;
                }
            });
    }

    // getCustomerCategory() {
    //     this.customerService
    //         .getCustomerCategory(this.selectedCustomerType)
    //         .subscribe((data: any) => {
    //             this.customerTypeList = data;
    //             console.log("Customer Type ", this.customerTypeList);
    //             // if (this.customerId) {
    //             //     this.selectedCustomerType = this.customerTypeList.filter(
    //             //         (customerType: CustomerCategory) =>
    //             //             customerType.customer_type ==
    //             //             this.customer.customer_type
    //             //     )[0];
    //             // }
    //             console.log(this.customer, "customer.customer_type");

    //             // this.selectedCustomerType = this.customerTypeList.find(
    //             //     (customerType: CustomerCategory) =>
    //             //         customerType.customer_type ===
    //             //         this.customer.customer_type
    //             // ) as CustomerCategory;

    //             // this.updatedSelectedProduct = this.productList.find(
    //             //     (prod: Product) => prod.uuid === this.customerProduct.product_uuid
    //             // ) as Product;
    //         });
    // }

    getCustomerCategory() {
        this.customerService
            .getCustomerCategory(this.customerTypeObj)
            .subscribe(
                (data: any) => {
                    this.customerTypeList = data;

                    if (this.customerId) {
                        this.getCustomerById();
                        return;
                    }

                    // if (this.customerId) {
                    //     this.selectedCustomerType = this.customerTypeList.filter(
                    //         (customerType: CustomerCategory) =>
                    //             customerType.customer_type ==
                    //             this.customer.customer_type
                    //     )[0];
                    // }

                    // this.selectedCustomerType = this.customerTypeList.find(
                    //     (customerType: CustomerCategory) =>
                    //         customerType.customer_type ===
                    //         this.customer.customer_type
                    // ) as CustomerCategory;
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    saveCustomer() {
        this.addCustomerForm.markAllAsTouched();
        if (!this.addCustomerForm.valid) {
            return;
        }
        this.addCustomerForm;
        let fd = new FormData();
        this.customer.roles = ["CUSTOMER"];
        this.customer.email = this.customer.email;
        this.customer.password = this.customer.email;
        this.customer.customer_type_uuid = this.selectedCustomerType?.uuid;
        this.customer.status_uuid = this.selectedContractStatus.uuid;
        this.customer.parent_group_uuid = this.selectedParentGroup.uuid;
        fd.append("data", JSON.stringify(this.customer));
        if (this.selectedDocument && this.selectedDocument[0]) {
            fd.append("kyc_document", this.selectedDocument[0]);
        }
        this.customerService.saveCustomer(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");

                this.router.navigate(["/panel/customer-management"]);
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    //json circular break at server side always add
                    //extra information of timestamp and status along with
                    //main json so parsing occurs still at status 200
                    let jsonString = err.error.text;
                    jsonString = jsonString.substr(
                        0,
                        jsonString.indexOf('{"timestamp"')
                    );
                } else if (err.status === 400) {
                    //console.log(err.error.error.message,'msg');
                    let jsonString = err;
                    console.log(jsonString, "jsonString");
                    this.msg = jsonString.error.error;
                    this.sweetAlertService.errorAlert(this.msg);
                }
            }
        );
    }

    updateAndAddCustomer() {
        this.addCustomerForm.markAllAsTouched();
        if (!this.addCustomerForm.valid) {
            return;
        }
        let fd = new FormData();
        this.customer.roles = ["CUSTOMER"];
        this.customer.password = this.customer.email;
        this.customer.customer_type_uuid = this.selectedCustomerType?.uuid;
        this.customer.parent_group_uuid = this.selectedParentGroup?.uuid;

        fd.append("data", JSON.stringify(this.customer));
        fd.append("kyc_document", this.selectedDocument[0]);

        this.customerService.updateCustomer(this.customerId, fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert(
                    "Data Updated Successfully!"
                );
                this.addCustomerForm.reset();
                this.activeIndex = 1;
            },
            (err) => {
                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    updateCustomer() {
        console.log(this.selectedCustomerType, "this.selectedCustomerType");
        this.addCustomerForm.markAllAsTouched();
        if (!this.addCustomerForm.valid) {
            return;
        }
        let fd = new FormData();
        let cust = {} as Customer;
        cust.roles = ["CUSTOMER"];
        cust.password = this.customer.email;
        cust.customer_type_uuid = this.selectedCustomerType?.uuid;
        cust.parent_group_uuid = this.selectedParentGroup?.uuid;
        fd.append("data", JSON.stringify(cust));

        fd.append("kyc_document", this.selectedDocument[0]);

        this.customerService.updateCustomer(this.customerId, fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert(
                    "Data Updated Successfully!"
                );
                this.router.navigate(["/panel/customer-management"]);
            },
            (err: HttpErrorResponse) => {
                if (err.status === 200) {
                    //json circular break at server side always add
                    //extra information of timestamp and status along with
                    //main json so parsing occurs still at status 200
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

    saveAndAddCustomer() {
        this.addCustomerForm.markAllAsTouched();
        if (!this.addCustomerForm.valid) {
            return;
        }
        this.addCustomerForm;
        let fd = new FormData();
        let cust = {} as Customer;
        this.customer.roles = ["CUSTOMER"];
        this.customer.email = this.customer.email;
        this.customer.password = this.customer.email;
        this.customer.customer_type_uuid = this.selectedCustomerType?.uuid;
        this.customer.status_uuid = this.selectedContractStatus.uuid;
        this.customer.parent_group_uuid = this.selectedParentGroup.uuid;
        fd.append("data", JSON.stringify(this.customer));
        if (this.selectedDocument && this.selectedDocument[0]) {
            fd.append("kyc_document", this.selectedDocument[0]);
        }
        this.customerService.saveCustomer(fd).subscribe(
            (data: any) => {
                this.customerId = data?.uuid;
                this.sweetAlertService.successAlert("Data added successfully!");
                // this.addCustomerForm.reset();
                this.activeIndex = 1;
            },
            (err) => {
                console.log(err);
                if (err.status === 200) {
                    // this.customerId = data?.uuid;
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );

                    this.activeIndex = 1;
                } else if (err.status === 400) {
                    this.sweetAlertService.errorAlert(err.error.error);
                } else {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            }
        );
    }

    addAddress() {
        this.addAddressForm.markAllAsTouched();
        if (!this.addAddressForm.valid) {
            return;
        }
        // this.address.address_1 = this.address1;
        // this.address.pincode = this.pincodeType;
        // this.address.spoc_name = this.spoc_name;
        // this.address.spoc_email = this.spoc_email;
        this.address.zone_uuid = this.selectedZone.uuid;
        this.address.zone = this.selectedZone.name;
        this.address.city_type = this.selectedCityType.name;
        this.address.user_uuid = this.customer.user_uuid;
        this.address.city = this.selectedCityPre.name;
        this.address.state = this.selectedState.name;
        if (!this.customer.addresses) {
            this.customer.addresses = [];
        }
        this.customer.addresses.push(JSON.parse(JSON.stringify(this.address)));
        this.customerService.saveAddress(this.address).subscribe(
            (data: any) => {
                this.sweetAlertService.successAlert("Address Added!");
            },
            (err: HttpErrorResponse) => {
                console.error(err, "err");
                this.sweetAlertService.errorAlert("Oops Something Went Wrong!");
            }
        );
        this.addAddressForm.reset();
        this.customer.addresses;
        if (this.customerId) {
            this.getCustomerById();
        }
        // this.selectedZone = new PredefinedMaster();
        // this.selectedCityType = new PredefinedMaster();
    }

    updateAddress() {
        this.updateAddressForm.markAllAsTouched();
        if (!this.updateAddressForm.valid) {
            return;
        }
        this.updateAddressForm.markAsUntouched();
        let addressTemp = {} as Address;
        addressTemp.address_1 = this.address1;
        addressTemp.address_2 = this.address2;
        addressTemp.pincode = this.pincodeType;
        addressTemp.spoc_name = this.spoc_name;
        addressTemp.spoc_email = this.spoc_email;
        addressTemp.zone_uuid = this.updateSelectedZone.uuid;
        addressTemp.city_type = this.updateSelectedCityType.name;
        addressTemp.user_uuid = this.customer.user_uuid;
        addressTemp.city = this.updateSelectedCity.name;
        addressTemp.state = this.updateSelectedState.name;
        if (!this.customer.addresses) {
            this.customer.addresses = [];
        }
        this.customerService
            .updateAddress(this.updatedAddress.uuid, addressTemp)
            .subscribe(
                (data: any) => {
                    this.sweetAlertService.successAlert("Address Updated!");
                    this.predefined.parent_uuid = undefined;
                    this.getCustomerById();
                    this.hideEditModal();
                },
                (err: HttpErrorResponse) => {
                    this.predefined.parent_uuid = undefined;

                    console.error(err, "err");
                    this.sweetAlertService.errorAlert(
                        "Oops Something Went Wrong!"
                    );
                    this.hideEditModal();
                }
            );
        this.address = {} as Address;
        this.selectedZone = new PredefinedMaster();
        this.selectedCityType = new PredefinedMaster();
    }

    deleteAddress(address: Address) {
        Swal.fire({
            title: "Are you sure?",
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
                this.customerService.deleteAddress(address).subscribe(
                    (data) => {
                        Swal.fire(
                            "Deleted!",
                            "Data deleted successfully.",
                            "success"
                        );
                        this.customer.addresses =
                            this.customer.addresses.filter(
                                (add: Address) => add.uuid !== address.uuid
                            );
                    },
                    (error) => {
                        if (error instanceof HttpErrorResponse) {
                            if (error.status === 200) {
                                Swal.fire(
                                    "Deleted!",
                                    "Data deleted successfully.",
                                    "success"
                                );
                                this.customer.addresses =
                                    this.customer.addresses.filter(
                                        (add: Address) =>
                                            add.uuid !== address.uuid
                                    );
                            } else {
                                this.sweetAlertService.errorAlert(
                                    "Oops Something Went Wrong!"
                                );
                            }
                        }
                    }
                );
            }
        });
    }

    activeDeactiveAddress(address: Address) {
        let deactiveActiveString: string;
        if (address.is_active == false) {
            deactiveActiveString = "Activate";
        } else if (address.is_active == true) {
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
                this.customerService
                    .statusForAddress(address.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Address " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.customer.addresses =
                            this.customer.addresses.filter(
                                (add: Address) => add.uuid !== address.uuid
                            );

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Address " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.customer.addresses =
                                        this.customer.addresses.filter(
                                            (add: Address) =>
                                                add.uuid !== address.uuid
                                        );
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    showEditModal(adddress: Address) {
        this.isShowAddressUpdate = true;
        this.getPredefinedByType("ZONE");
        this.getPredefinedByType("CITY-TYPE");
        this.getPredefinedByType("STATE");

        this.updatedAddress = adddress;
        this.address1 = this.updatedAddress.address_1;
        this.address2 = this.updatedAddress.address_2;
        this.spoc_name = this.updatedAddress.spoc_name;
        this.spoc_email = this.updatedAddress.spoc_email;
        this.pincodeType = this.updatedAddress.pincode;

        this.updateSelectedCity = this.cityList.find(
            (city: PredefinedMaster) => city.name === this.updatedAddress.city
        );

        this.updateSelectedState = this.stateList.find(
            (state: PredefinedMaster) =>
                state.name === this.updatedAddress.state
        );

        this.updateSelectedCityType = this.cityTypeList.find(
            (cityType: PredefinedMaster) =>
                cityType.name === this.updatedAddress.city_type
        );

        this.updateSelectedZone = this.zoneList.find(
            (zone: PredefinedMaster) => zone.name === this.updatedAddress.zone
        );

        // this.updateSelectedCity = this.cityList.filter(
        //     (city: PredefinedMaster) => city.name === adddress.city
        // )[0];

        // debugger;

        // this.updateSelectedState = this.stateList.filter(
        //     (state: PredefinedMaster) => state.name === adddress.state
        // )[0];
        // this.updateSelectedCityType = this.cityTypeList.filter(
        //     (cityType: PredefinedMaster) => cityType.name === adddress.city_type
        // )[0];
        // this.updateSelectedZone = this.zoneList.filter(
        //     (zone: PredefinedMaster) => zone.name === adddress.zone
        // )[0];
    }

    hideEditModal() {
        this.isShowAddressUpdate = false;
    }

    addYearToDate(date: Date, years: number) {
        const newDate = new Date(date); // Create a copy to avoid mutating the original
        newDate.setFullYear(newDate.getFullYear() + years); // Add the desired years
        return newDate;
    }

    saveCustomerProduct() {
        this.addProductForm.markAllAsTouched();
        if (!this.addProductForm.valid) {
            return;
        }

        this.customerProduct.customer_uuid = this.customerId;
        this.customerProduct.product_uuid = this.selectedProduct.uuid;
        this.customerProduct.location_uuid = this.selectedCity.uuid;
        console.log(
            this.customerProduct.location_uuid,
            "  this.customerProduct.location_uuid "
        );
        this.customerProduct.start_date_for_life = this.datePipe.transform(
            this.selectedDate,
            "yyyy-MM-dd"
        );
        this.productService.saveCustomerProduct(this.customerProduct).subscribe(
            (data: any) => {
                this.addProductForm.reset();
                this.contractItem = {} as ContractItem;
                this.selectedProduct = {} as Product;
                // this.customerProduct = {} as CustomerProduct;
                this.selectedCategory = {} as ProductCategory;
                // this.customer.addresses = [];
                this.selectedDate = null;

                this.sweetAlertService.successAlert(
                    "Added Product For Customer!"
                );
                this.setProductFormProperties();
                this.getCustomerProductList();
            },
            (err: HttpErrorResponse) => {
                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    updateCustomerProduct() {
        this.updateProductForm.markAllAsTouched();
        if (!this.updateProductForm.valid) {
            return;
        }
        this.selectedCity.city = undefined;
        this.customerProduct.product_category = undefined;
        this.customerProduct.location = undefined;
        this.customerProduct.product_name = undefined;
        this.customerProduct.sap_oracle_code = undefined;
        this.customerProduct.uuid = undefined;

        this.customerProduct.customer_uuid = this.customerId;
        this.customerProduct.product_uuid = this.updatedSelectedProduct.uuid;
        this.customerProduct.location_uuid = this.selectedCity.uuid;
        this.customerProduct.sku = this.updateCustomerProductObj.sku;
        this.customerProduct.serial_no =
            this.updateCustomerProductObj.serial_no;
        this.customerProduct.start_date_for_life = this.datePipe.transform(
            this.updatedSelectedDate,
            "yyyy-MM-dd"
        );
        this.customerProduct.end_date = undefined;
        let formData = new FormData();
        formData.append("data", JSON.stringify(this.customerProduct));
        this.productService
            .updateCustomerProduct(this.uuidCustomerProduct.uuid, formData)
            .subscribe(
                (data: any) => {
                    this.sweetAlertService.successAlert(
                        "Updated Product For Customer!"
                    );
                    this.isShowProductDetails = false;
                    this.getCustomerProductList();
                },
                (err: HttpErrorResponse) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.isShowProductDetails = false;
                }
            );
    }

    deleteCustomerProduct(customerProduct: CustomerProduct) {
        Swal.fire({
            title: "Are you sure?",
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
                this.productService
                    .deleteCustomerProduct(customerProduct.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getCustomerProductList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getCustomerProductList();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactiveCustomerProduct(service: CustomerProduct) {
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
                    .statusForCustomerProduct(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Customer Product " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getCustomerProductList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Customer Product " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getCustomerProductList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    getProductList() {
        this.product.product_category_uuid = this.selectedCategory.uuid;
        this.product.per_page = 50;
        this.product.page = 1;
        this.productService.getProductList(this.product).subscribe(
            (data) => {
                this.productList = data;
                // this.productList.forEach(element => {
                //     if(element.product_name==  this.customerProduct?.product_name){
                //         this.updatedSelectedProduct = element;
                //     }

                // });

                console.log("Listtt", this.productList);
            },
            (err: any) => {
                console.error(err, "ERR");
            }
        );
    }

    getProductCategoryList() {
        this.productCategory.per_page = 50;
        this.productCategory.page = 1;
        this.productService
            .getProductCategoryList(this.productCategory)
            .subscribe(
                (data: any) => {
                    this.categoryList = data;
                    this.categoryList.forEach((element) => {
                        if (
                            element.product_category ==
                            this.customerProduct?.product_category
                        ) {
                            this.selectedCategory = element;
                        }
                    });
                },
                (err: any) => {
                    console.error(err, "ERR");
                }
            );
    }

    getCustomerProductList() {
        this.customerProduct.customer_uuid = this.customerId;
        this.customerProduct.per_page = 50;
        this.productService
            .getCustomerProductList(this.customerProduct)
            .subscribe(
                (data: any) => {
                    this.customerProductList = data;

                    this.customerProductList.forEach((value) => {
                        this.uuidCustomerProduct.uuid = value.uuid;
                        console.log("Listtt", value.uuid);
                    });

                    this.customerProductList.map((product: CustomerProduct) => {
                        const startDate = new Date(product.start_date_for_life); // Convert string to Date

                        if (!isNaN(startDate.getTime())) {
                            // Check if date is valid
                            const endDate = new Date(startDate);
                            endDate.setFullYear(
                                startDate.getFullYear() +
                                    Number(product.approx_life)
                            );

                            product.end_date = endDate;
                        } else {
                            console.error("Invalid start_date_for_life format");
                        }

                        console.log(product.end_date, "product.end_date");
                        return product;
                    });
                    console.log("Customer Product", this.customerProductList);
                },
                (err: any) => {
                    console.error(err, "ERR");
                }
            );
    }

    onFileSelected(event: any) {
        this.selectedFiles = event.currentFiles;
        this.selectedDocument = this.selectedFiles;
        console.log(this.selectedDocument, "this.selectedDocument");

        if (this.selectedFiles.length > 0) {
            const file = this.selectedFiles[0];
            if (file.size > 2097152) {
                console.error("File size exceeds 2MB");
            } else if (file.type !== "application/pdf") {
                console.error("Invalid file type. Only PDFs are allowed.");
            }
        }

        this.selectedPersonalFile = event.currentFiles.map((file) => {
            return {
                name: file.name,
                objectURL: URL.createObjectURL(file),
            };
        });
    }

    redirectToCreateOrder() {
        this.router.navigate([
            "/panel/create-order-customer/" + this.customerId,
        ]);
    }

    getCustomerContractList() {
        this.contract.customer_uuid = this.customerId;
        this.customerService.getCustomerContractList(this.contract).subscribe(
            (data: any) => {
                this.contractList = data;
                console.log(this.contractList, "this.contractList");
            },
            (err: any) => {
                console.error(err, "ERR");
            }
        );
    }

    getContractItemWiseList(contractId: string) {
        this.customerService.getCustomerContractItemList(contractId).subscribe(
            (data: any) => {
                // this.contractItemList = data;
                this.contractItemList = data.map((item: any) => ({
                    ...item,
                    start_date: formatDate(
                        item.start_date,
                        "dd-MM-yyyy",
                        "en-US"
                    ),
                    end_date: formatDate(item.end_date, "dd-MM-yyyy", "en-US"),
                }));
            },
            (err: any) => {
                console.error(err, "ERR");
            }
        );
    }

    getCustomerContractById(contractId: string) {
        this.customerService.getCustomerContractById(contractId).subscribe(
            (data: any) => {
                this.contract = data;
                if (this.contract.payment_frequency?.uuid) {
                    this.selectedSplitPayment = this.splitPaymentList.filter(
                        (split: PredefinedMaster) =>
                            split.uuid == this.contract.payment_frequency?.uuid
                    )[0];
                }
                if (this.contract.billing_city) {
                    this.selectedBillingCityPre = this.cityList.filter(
                        (city: PredefinedMaster) =>
                            city.name == this.contract.billing_city
                    )[0];
                }
                if (this.contract.billing_state) {
                    this.selectedBillingState = this.stateList.filter(
                        (state: PredefinedMaster) =>
                            state.name == this.contract.billing_state
                    )[0];
                }

                if (this.contract.legal_entity_uuid) {
                    this.selectedLegalEntity = this.legalEntityList.filter(
                        (Legal: LegalEntity) =>
                            Legal.name == this.contract.legal_entity_uuid
                    )[0];
                }

                if (this.contract.branch_uuid) {
                    this.selectedLegalBranch = this.legalBranchList.filter(
                        (Legal: LegalBranch) =>
                            Legal.name == this.contract.branch_uuid
                    )[0];
                }

                if (this.contract.contract_date) {
                    this.selectedContractDate = this.contract.contract_date
                        ? new Date(this.contract.contract_date)
                        : null;
                }
                if (this.contract?.document?.uuid) {
                    this.is_already_signed = true;
                }
                if (this.contract?.contract_status?.name === "Signed") {
                    this.if_signed = true;
                } else {
                    this.if_signed = false;
                }
                this.getContractItemWiseList(this.contract.uuid);
            },
            (err: any) => {
                console.error(err, "ERR");
            }
        );
    }

    downloadDocument() {
        if (this.contract?.document) {
            const { file_path } = this.contract.document;
            window.open(file_path, "_blank");
        } else {
            console.error("Document not available");
        }
    }

    downloadDocumentPersonal() {
        console.log(this.customer.kyc_document_path);
        if (this.customer?.kyc_document_path) {
            // const { file_path1 } = this.customer?.kyc_document_path;

            //  console.log(file_path1,"file_path1")
            window.open(this.customer?.kyc_document_path, "_blank");
        } else {
            console.error("Document not available");
        }
    }
    uploadAgreement(event: UploadEvent) {
        this.selectedFiles = event.currentFiles;
        this.selectedContractFile = event.currentFiles.map((file) => {
            return {
                name: file.name,
                objectURL: URL.createObjectURL(file),
            };
        });
    }

    reselectFile(fileUploader: any) {
        this.selectedFiles = [];
        this.selectedContractFile = [];
        fileUploader.clear();
        console.log("File selection cleared, user can reselect now.");
    }
    reselectFile1(fileUploader: any) {
        this.selectedDocument = [];
        this.selectedPersonalFile = [];
        fileUploader.clear();
        console.log("File selection cleared, user can reselect now.");
    }

    viewPdf(pdfUrl: string) {
        window.open(pdfUrl, "_blank");
    }

    editContract(contract: Contract) {
        this.isContractEdit = true;
        this.getCustomerContractById(contract.uuid);
        this.contract = contract;
    }
    addContractDiscount() {
        let contract = {} as ContractItem;
        console.log(this.contractBeingEdited, "Contact");
        console.log(this.contractBeingEdited.uuid, "Contactuuid");
        // if (this.contractBeingEdited) {
        contract.discount_percent = this.contractItem.discount_percent;
        // this.contractBeingEdited = null;
        // }
        this.isShowContractDiscount = false;

        this.customerService
            .itemContractUpdate(this.contractBeingEdited.uuid, contract)
            .subscribe(
                (data: any) => {
                    this.sweetAlertService.successAlert(
                        "Contract Updated Successfully"
                    );
                    this.getContractItemWiseList(this.contract.uuid);
                },
                (err: any) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    updateContract(is_esign: boolean) {
        this.contractUpdateForm.markAllAsTouched();

        // if (
        //     !this.contractUpdateForm.get("legalEntity")?.value &&
        //     !this.contractUpdateForm.get("legalBranch")?.value
        // ) {
        //     this.contractUpdateForm
        //         .get("legalEntity")
        //         ?.setValidators([Validators.required]);
        //     this.contractUpdateForm
        //         .get("legalBranch")
        //         ?.setValidators([Validators.required]);
        // }

        // this.contractUpdateForm.get("legalEntity")?.updateValueAndValidity();
        // this.contractUpdateForm.get("legalBranch")?.updateValueAndValidity();

        if (!this.contractUpdateForm.valid) {
            return;
        }
        if (
            this.is_already_signed &&
            this.selectedFiles.length == 0 &&
            !this.contract?.document?.file_path
        ) {
            this.sweetAlertService.errorAlert("Please upload agreement!");
            return;
        }
        // this.contractItem.discount;
        this.contract.sent_esign = is_esign;
        this.contract.payment_frequency_uuid = this.selectedSplitPayment.uuid;
        this.contract.billing_state = this.selectedBillingState.name;
        this.contract.billing_city = this.selectedBillingCityPre.name;

        this.contract.legal_entity_uuid = this.selectedLegalEntity?.uuid;
        this.contract.branch_uuid = this.selectedLegalBranch?.uuid;
        this.contract.contract_date = this.datePipe.transform(
            this.selectedContractDate,
            "yyyy-MM-dd"
        );

        this.contract.legal_entity = undefined;
        this.contract.branch = undefined;
        this.contract.items = undefined;

        if (this.is_already_signed) {
            this.contract.esign_status_uuid = this.contractStatusList.filter(
                (status: PredefinedMaster) => status.code === "Signed"
            )[0].uuid;
        } else {
            this.contract.esign_status_uuid = this.contractStatusList.filter(
                (status: PredefinedMaster) => status.code === "Awaiting-E-Sign"
            )[0].uuid;
        }
        this.contract.contract_status_uuid = this.contract.esign_status_uuid;
        this.contract.contract_status = undefined;

        // this.contract.
        console.log(this.contract, "Contract");
        console.log(this.selectedFiles, "Files");

        let contractReq = JSON.parse(JSON.stringify(this.contract));
        contractReq.uuid = undefined;
        contractReq.document = undefined;
        contractReq.payment_frequency = undefined;
        contractReq.sent_esign = true;

        let formData = new FormData();
        formData.append("data", JSON.stringify(contractReq));
        if (this.selectedFiles && this.selectedFiles[0]) {
            formData.append("contract_documents", this.selectedFiles[0]);
        }

        this.customerService
            .updateContract(this.contract.uuid, formData)
            .subscribe(
                (data: any) => {
                    this.sweetAlertService.successAlert(
                        "Contract Updated Successfully"
                    );
                    // this.contractUpdateForm.reset();
                    this.getCustomerContractList();
                },
                (err: any) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    getServiceRequestListData(serviceRequest: ServiceRequestMaster) {
        serviceRequest.customer_uuid = this.customerId;
        this.customerService
            .getServiceRequestList(serviceRequest)
            .subscribe((data: any) => {
                this.serviceRequestList = data;
            });
    }

    searchStatus() {
        if (this.selectedServiceStatus?.uuid) {
            this.serviceRequest.status_uuid = this.selectedServiceStatus?.uuid;
        } else {
            this.serviceRequest.status_uuid = null;
        }
        this.customerService
            .getServiceRequestList(this.serviceRequest)
            .subscribe((data: any) => {
                this.serviceRequestList = data;
            });
    }

    deleteContractDetail(event) {
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
                let delCustomer = this.contract;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.customerService
                    .deleteContractDetail(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Contract Detail successfully.",
                                "success"
                            );
                            this.getCustomerContractList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Contract Detail successfully.",
                                        "success"
                                    );
                                    this.getCustomerContractList();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactiveContract(service: Contract) {
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
                this.customerService
                    .statusForContract(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Contract " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getCustomerContractList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Contract " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getCustomerContractList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    searchParent(event) {
        this.predefineType.search_by = event.query;
        this.getPredefinedByType("PARENT-GROUP");
    }

    onChangeOfState(event) {
        this.isStateSelected = !!this.selectedState;
        this.predefined.parent_uuid = this.selectedState?.uuid;
        this.getPredefinedByType(event);
    }

    onChangeOfEditState(event) {
        this.isStateSelected = !!this.updateSelectedState;
        this.predefined.parent_uuid = this.updateSelectedState?.uuid;
        this.getPredefinedByType(event);
    }

    onChangeOfStateBilling(event) {
        this.isStateSelected = !!this.selectedBillingState;
        this.predefined.parent_uuid = this.selectedBillingState?.uuid;
        this.getPredefinedByType(event);
    }

    getOrderDetailsList() {
        this.oredrDetailsObject.customer_uuid = this.customerId;
        this.orderDetails
            .getOrderDetailsList(this.oredrDetailsObject)
            .subscribe(
                (data: any) => {
                    this.customerInvoiceList = data;

                    // console.log("Oredr Details List", this.oredrDetailsList);
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getLegalEntityList() {
        this.legalEntityService
            .getLegalEntityList(this.legalEntityObject)
            .subscribe(
                (data: any) => {
                    this.legalEntityList = data;
                },
                (err) => {
                    console.log("Something went wrong:", err);
                }
            );
    }

    getLegalBranchList() {
        this.legalBranchObject.is_active = true;
        this.legalEntityService
            .getLegalBranchList(this.legalBranchObject)
            .subscribe(
                (data: any) => {
                    this.legalBranchList = data;
                },
                (err) => {
                    console.log(err, "Something wrong");
                }
            );
    }

    onLegalEntitySelect() {
        if (this.selectedLegalEntity) {
            this.disableLegalBranch = true;
            this.selectedLegalBranch = null;
        }
    }

    onLegalBranchSelect() {
        if (this.selectedLegalBranch) {
            this.disableLegalEntity = true;
            this.selectedLegalEntity = null;
        }
    }

    // onLegalEntitySelect() {
    //     if (this.contractUpdateForm.get("legalEntity")?.value) {
    //         this.contractUpdateForm
    //             .get("legalEntity")
    //             ?.setValidators([Validators.required]);
    //         this.contractUpdateForm.get("legalBranch")?.clearValidators();

    //         this.contractUpdateForm
    //             .get("legalEntity")
    //             ?.updateValueAndValidity();
    //         this.contractUpdateForm
    //             .get("legalBranch")
    //             ?.updateValueAndValidity();

    //         this.disableLegalBranch = true;
    //         this.contractUpdateForm.get("legalBranch")?.setValue(null);
    //     }
    // }

    // onLegalBranchSelect() {
    //     if (this.contractUpdateForm.get("legalBranch")?.value) {
    //         this.contractUpdateForm
    //             .get("legalBranch")
    //             ?.setValidators([Validators.required]);
    //         this.contractUpdateForm.get("legalEntity")?.clearValidators();

    //         this.contractUpdateForm
    //             .get("legalEntity")
    //             ?.updateValueAndValidity();
    //         this.contractUpdateForm
    //             .get("legalBranch")
    //             ?.updateValueAndValidity();

    //         this.disableLegalEntity = true;
    //         this.contractUpdateForm.get("legalEntity")?.setValue(null);
    //     }
    // }

    clearLegalEntity() {
        this.selectedLegalEntity = null;
        this.disableLegalBranch = false;

        // this.contractUpdateForm
        //     .get("legalBranch")
        //     ?.setValidators(Validators.required);
        // this.contractUpdateForm.get("legalBranch")?.updateValueAndValidity();
    }

    clearLegalBranch() {
        this.selectedLegalBranch = null;
        this.disableLegalEntity = false;

        // this.contractUpdateForm
        //     .get("legalEntity")
        //     ?.setValidators(Validators.required);
        // this.contractUpdateForm.get("legalEntity")?.updateValueAndValidity();
    }

    backToContractList() {
        this.isContractEdit = false;
    }
}
