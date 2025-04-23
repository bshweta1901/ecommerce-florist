import { DatePipe } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
    CustomerCategory,
    Customer,
    Address,
} from "src/app/demo/domain/customer";
import {
    LegalBranch,
    LegalEntity,
    LegalSubsidiary,
    RegisteredAddress,
} from "src/app/model/LegalEntity.model";
import { PredefinedMaster } from "src/app/model/PredefinedMaster.model";
import { ProductCategory } from "src/app/model/Product";
import { SlotMaster } from "src/app/model/ServiceRequest.model";
import { SparePartManager } from "src/app/model/SparePartMaster.model";
import { AuthService } from "src/app/service/auth.service";
import { CustomerService } from "src/app/service/customerservice";
import { LegalEntityService } from "src/app/service/legalEntity.service";
import { PredefinedService } from "src/app/service/predefined.service";
import { ProductService } from "src/app/service/product.service";
import { ServiceRequestService } from "src/app/service/servicerequest.service";
import { SweetAlertService } from "src/app/service/sweet-alert.service";
import { UnavailabilityService } from "src/app/service/unavailability.service";
import Swal from "sweetalert2";

@Component({
    selector: "app-master-setting",
    templateUrl: "./master-setting.component.html",
    styleUrls: ["./master-setting.component.scss"],
})
export class MasterSettingComponent implements OnInit {
    @ViewChild("fileUpload") fileUpload: any;
    @ViewChild("fileUploadTwo") fileUploadTwo: any;
    @ViewChild("fileUploadUpdateOne") fileUploadUpdateOne: any;
    @ViewChild("fileUploadUpdateTwo") fileUploadUpdateTwo: any;
    editEntityEventForProductCategory: boolean = false;
    editDialogBoxForCustomerCategory: boolean = false;
    editDialogModuleForState: boolean = false;
    editDialogModuleForCity: boolean = false;
    editDialogModuleForZone: boolean = false;
    editDialogModuleForParentGroup: boolean = false;
    editDialogModuleForUnAvailability: boolean = false;
    editDialogModuleForProductOEM = false;
    editDialogModuleForEntityCurrency = false;
    editDialogBoxForProductType: boolean = false;
    editDialogBoxForSlotType: boolean = false;
    editDialogBoxForCityTab: boolean = false;
    editDialogBoxForLegalEntity: boolean = false;
    editDialogBoxForLegalBranch: boolean = false;
    editDialogBoxForLegalSubsidiary: boolean = false;
    openDialogBoxForRepairCheclist: boolean = false;
    openDialogBoxForProblemDiagnosis: boolean = false;
    openEditDialogModuleRepairCheclist: boolean = false;
    openEditDialogModuleCategoryName: boolean = false;
    editDialogModuleProblemDiagnosisEvent: boolean = false;
    problemStatementFields: string[] = [""];
    customerId: string;
    tableColsEventForCustomerType: any[] = [];
    tableColsEventForSlotType: any[] = [];
    tableColsEventForCity: any[] = [];
    tableColsEventForZone: any[] = [];
    tableColsEventForParent: any[] = [];
    tableColsEventForLocation: any[] = [];
    tableColsEventForProductCategory: any[] = [];
    tableColsRepairChecklist: any[] = [];
    tableColsProblemDiagnosis: any[] = [];
    tableColsEventForProductCategorySOP: any[] = [];
    tableColsEventForUnavailability: any[] = [];
    tableColsEventForEntityCurrency: any[] = [];
    tableColsEventForLegalEntity: any[] = [];
    tableColsEventForLegalBranche: any[] = [];
    tableColsEventForLegalSubsidiary: any[] = [];
    tableColsEventForCityTab: any[] = [];
    tableColsEventForProductType: any[] = [];
    tableColsEventForProductOEM: any[] = [];
    tableSettingsEvent: any = {};
    tableCategotySettingsEvent: any = {};
    tableSettingsCategory: any = {};
    tableSettingsRepairChecklist: any = {};
    tableSettingsProblemDiagnosis: any = {};
    tableSettingsProductType: any = {};
    tableSettingsSlotType: any = {};
    tableSettingsLegailEntity: any = {};
    tableSettingsEventTwo: any = {};
    tableSettingsEventStateAndCity: any = {};
    parentGroupTableSettingEvent: any = {};
    eventList: any[] = [];
    titleEVent: any;
    hideButtonView: boolean = false;
    pageSize: number = 5;
    searchPlaceholder: string = "";
    searchPlaceholderState: string = "";
    searchPlaceholderCity: string = "";
    searchPlaceholderZone: string = "";
    searchPlaceholderParent: string = "";
    searchPlaceholderUnAvailability: string = "";
    searchPlaceholderProductOEM: string = "";
    searchPlaceholderEntityCurrency: string = "";
    searchPlaceholderSparePart: string = "";
    searchPlaceholderCityTab: string = "";
    searchPlaceholderSlotType: string = "";
    searchPlaceholderCategory: string = "";
    searchPlaceholderLegalEntity: string = "";
    searchPlaceholderLegalBranch: string = "";
    searchPlaceholderLegalSubsidiary: string = "";
    pageNumber: number = 0;
    totalRecords: number;
    totalRecordsForZone: number;
    totalRecordsForState: number;
    totalRecordsForCity: number;
    totalRecordsForCityType: number;
    totalRecordsForParentGroup: number;
    totalRecordsForOEM: number;
    totalRecordsForCurrency: number;
    totalRecordsForUnAvailability: number;
    totalRecordsForLegalEntity: number;
    totalRecordsForBranch: number;
    totalRecordsForSubsidiary: number;
    totalRecordsForProductCategory: number;
    totalRecordsForSparePart: number;
    totalRecordsForCustomerType: number;
    totalRecordsForTimeSlot: number;
    msg: any;
    fileSave: any;
    dialogWidth = "450px";
    dialogWidthForLegalEntity = "70%";
    statusList: any[] = [];
    visibleSidebar: boolean = false;
    customerTypeList: CustomerCategory[] = [];
    unAvailabilityTypeList: PredefinedMaster[] = [];
    selectedCustomerType: CustomerCategory = {} as CustomerCategory;
    updateCustomerType: CustomerCategory = {} as CustomerCategory;
    customer: Customer = {} as Customer;
    zoneList: PredefinedMaster[] = [];
    parentGroupList: PredefinedMaster[] = [];
    ProductOEMList: PredefinedMaster[] = [];
    currencyList: PredefinedMaster[] = [];
    predefined: PredefinedMaster = { page_size: 10000 } as PredefinedMaster;
    selectedZone: PredefinedMaster = new PredefinedMaster();
    selectedParentGroup: PredefinedMaster = new PredefinedMaster();
    selectedStateValue: PredefinedMaster = new PredefinedMaster();
    cityTypeList: PredefinedMaster[] = [];
    countryTypeList: PredefinedMaster[] = [];
    selectedCityType: PredefinedMaster = new PredefinedMaster();
    selectedCountry: PredefinedMaster = new PredefinedMaster();
    selectedCityPre: PredefinedMaster = new PredefinedMaster();
    selectedUnavailabity: PredefinedMaster = new PredefinedMaster();
    selectedProductOEM: PredefinedMaster = new PredefinedMaster();
    selectedEntityCurrency: PredefinedMaster = new PredefinedMaster();
    categoryList: PredefinedMaster[] = [];
    selectedCategory: PredefinedMaster = new PredefinedMaster();
    stateList: PredefinedMaster[] = [];
    cityList: PredefinedMaster[] = [];
    selectedState: PredefinedMaster = {} as PredefinedMaster;
    selectedLegalCity: PredefinedMaster = {} as PredefinedMaster;
    updatedSelectedState: PredefinedMaster = {} as PredefinedMaster;
    predefineObject: PredefinedMaster = {} as PredefinedMaster;
    selectedCityTabName: PredefinedMaster = {} as PredefinedMaster;
    cityTabPredefineObject: PredefinedMaster = {} as PredefinedMaster;
    selectedPredefineState: PredefinedMaster = {} as PredefinedMaster;
    address: Address = {} as Address;
    selectedCity: Address = {} as Address;
    productCategory: ProductCategory = {} as ProductCategory;
    productCategoryList: ProductCategory[] = [];
    repaiChecklistList: ProductCategory[] = [];
    repaiProblemDiagnosis: ProductCategory[] = [];
    productCategoryUuidList: ProductCategory[] = [];
    getRepairAndPronlemIdObj: ProductCategory[] = [];
    backToProductCategory: boolean = false;
    selectedProductType: ProductCategory = {} as ProductCategory;
    productCategoryObject: ProductCategory = {} as ProductCategory;
    updateRepairAndProblemObj: ProductCategory = {} as ProductCategory;
    categoryRepairChecklistObj: ProductCategory = {} as ProductCategory;
    categoryProblemDiagnosisObj: ProductCategory = {} as ProductCategory;
    customerCategoryObject: ProductCategory = {} as ProductCategory;
    updatedPredefineObject: PredefinedMaster = {} as PredefinedMaster;
    updatedProductCategoryName: ProductCategory = {} as ProductCategory;
    sopFields: string[] = [""];
    pssFields: string[] = [""];
    posValue: string = "";
    sopValue: string = "";
    openEditDialogModuleEventForProductCategory: boolean = false;
    sparePartManagerObject: SparePartManager = {} as SparePartManager;
    sparePartManagerList: SparePartManager[] = [];
    updateSparePartObject: SparePartManager = {} as SparePartManager;
    slotManagerObject: SlotMaster = {} as SlotMaster;
    serachSlotObject: SlotMaster = {} as SlotMaster;
    slotManagerList: SlotMaster[] = [];
    legalEntityObject: LegalEntity = {} as LegalEntity;
    legalBranchObject: LegalBranch = {} as LegalBranch;
    legalSubsidiaryObject: LegalSubsidiary = {} as LegalSubsidiary;
    legalEntityList: LegalEntity[] = [];
    legalBranchList: LegalBranch[] = [];
    legalSubsidiaryList: LegalSubsidiary[] = [];
    selectedLegalBranch: any[] = [];
    selectedLegalSubsidiaries: any[] = [];
    selectedLegalEntity: LegalEntity = {} as LegalEntity;
    updatedLegalEntityObject: LegalEntity = {} as LegalEntity;
    updatedLegalBranchObject: LegalBranch = {} as LegalBranch;
    updatedLegalSubsidiaryObject: LegalSubsidiary = {} as LegalSubsidiary;
    updateSelectedEntity: LegalEntity = {} as LegalEntity;
    updateSelectedBranch: any[] = [];
    updateSelectedSubsidiaries: any[] = [];
    selectedStartTime: string;
    selectedEndTime: string;
    store_is_ps_sop: any;
    selectedStartTimeDate: Date;
    selectedEndTimeDate: Date;
    updateStartTimeDate: Date;
    updateEndTimeDate: Date;
    updatedStartTime: any = {} as any;
    updatedEndTime: any = {} as any;
    updateSlotObject: SlotMaster = {} as SlotMaster;
    updateImageSrc: any;
    uploadImagePath: any;
    imageSrc: any;
    updatedLegalCountry: PredefinedMaster = new PredefinedMaster();
    updatedLegalState: PredefinedMaster = new PredefinedMaster();
    updatedLegalCity: PredefinedMaster = new PredefinedMaster();

    customerTypeForm: FormGroup;
    stateForm: FormGroup;
    cityForm: FormGroup;
    zoneForm: FormGroup;
    parentGroupForm: FormGroup;
    productCategoryForm: FormGroup;
    unavailabilityForm: FormGroup;
    entityCurrencyForm: FormGroup;
    productOEMForm: FormGroup;
    sparePartTypeForm: FormGroup;
    cityTypeForm: FormGroup;
    slotTypeForm: FormGroup;
    updateSlotForm: FormGroup;
    showText: boolean = false;
    updateSlotTwoForm: FormGroup;
    updatedForms: FormGroup;
    updatedStateForms: FormGroup;
    updatedParentGroupForm: FormGroup;
    updatedCityForms: FormGroup;
    updatedZoneForm: FormGroup;
    updatedUnavailabilityForm: FormGroup;
    updatedSparePartForm: FormGroup;
    updatedProductOEMForm: FormGroup;
    updatedCurrencytForm: FormGroup;
    updatedCityTabForm: FormGroup;
    repairChecklistForm: FormGroup;
    problemStatementForm: FormGroup;
    categoryNameForm: FormGroup;
    legalEntityForm: FormGroup;
    legalBrancheForm: FormGroup;
    legalSubsidiaryForm: FormGroup;
    editRepairForm: FormGroup;
    editProblemForm: FormGroup;
    updatedLegalEntityForm: FormGroup;
    updatedLegalBranchForm: FormGroup;
    updatedLegalSubsidiaryForm: FormGroup;
    showInput: boolean = false;
    constructor(
        public authService: AuthService,
        private customerService: CustomerService,
        private sweetAlertService: SweetAlertService,
        private predefinedService: PredefinedService,
        private productService: ProductService,
        private serviceRequestService: ServiceRequestService,
        private legalEntityService: LegalEntityService,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.customerTypeForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });
        this.stateForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });
        this.cityForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });
        this.zoneForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });

        this.parentGroupForm = new FormGroup({
            value: new FormControl("", Validators.required),
            code: new FormControl("", Validators.required),
        });
        this.productCategoryForm = new FormGroup({
            product_category: new FormControl("", Validators.required),
        });
        this.unavailabilityForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });
        this.productOEMForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });
        this.entityCurrencyForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });
        this.sparePartTypeForm = new FormGroup({
            value: new FormControl("", Validators.required),
        });
        this.cityTypeForm = new FormGroup({
            state: new FormControl("", Validators.required),
            cityType: new FormControl("", Validators.required),
        });
        this.slotTypeForm = new FormGroup({
            slotName: new FormControl("", Validators.required),
            selectedStartTime: new FormControl("", Validators.required),
            selectedEndTime: new FormControl("", Validators.required),
        });

        this.updateSlotForm = new FormGroup({
            updateName: new FormControl("", Validators.required),
            updatedStartTime: new FormControl("", [Validators.required]),
        });

        this.updateSlotTwoForm = new FormGroup({
            updatedEndTime: new FormControl("", [Validators.required]),
        });

        this.updatedForms = new FormGroup({
            customerType: new FormControl("", Validators.required),
        });

        this.updatedStateForms = new FormGroup({
            updateStateType: new FormControl("", Validators.required),
        });

        this.updatedParentGroupForm = new FormGroup({
            parentGroupName: new FormControl("", Validators.required),
            parentGroupCode: new FormControl("", Validators.required),
        });

        this.updatedCityForms = new FormGroup({
            cityTypeName: new FormControl("", Validators.required),
        });

        this.updatedZoneForm = new FormGroup({
            zoneTypeName: new FormControl("", Validators.required),
        });

        this.updatedUnavailabilityForm = new FormGroup({
            unavailabilityTypeName: new FormControl("", Validators.required),
        });

        this.updatedSparePartForm = new FormGroup({
            sparePartTypeName: new FormControl("", Validators.required),
        });

        this.updatedProductOEMForm = new FormGroup({
            OemName: new FormControl("", Validators.required),
        });

        this.updatedCurrencytForm = new FormGroup({
            CurrencyName: new FormControl("", Validators.required),
        });

        this.updatedCityTabForm = new FormGroup({
            updatedSelectedState: new FormControl("", Validators.required),
            cityTabTypeName: new FormControl("", Validators.required),
        });

        this.repairChecklistForm = new FormGroup({
            addRepairChecklist: new FormControl("", Validators.required),
        });

        this.problemStatementForm = new FormGroup({
            addproblemStatement: new FormControl("", Validators.required),
        });

        this.categoryNameForm = new FormGroup({
            editCategoryName: new FormControl("", Validators.required),
        });

        this.legalEntityForm = new FormGroup({
            name: new FormControl("", [
                Validators.required,
                Validators.pattern("^[A-Za-z _-]+$"),
            ]),
            gstNumber: new FormControl("", Validators.required),
            panNumber: new FormControl("", Validators.required),
            financialYear: new FormControl("", Validators.required),
            rocNumber: new FormControl("", Validators.required),
            tdsNumber: new FormControl("", Validators.required),
            // registeredAddress: new FormControl("", Validators.required),
            selectedLegalBranch: new FormControl(""),
            selectedLegalSubsidiaries: new FormControl(""),
            bank_name: new FormControl("", Validators.required),
            bank_account_name: new FormControl("", Validators.required),
            bank_account_number: new FormControl("", Validators.required),
            bank_ifsc_code: new FormControl("", Validators.required),
            address_1: new FormControl("", Validators.required),
            state: new FormControl("", Validators.required),
            country: new FormControl("", Validators.required),
            city: new FormControl("", Validators.required),
            pincode: new FormControl("", Validators.required),
            address_2: new FormControl(""),
        });

        this.legalBrancheForm = new FormGroup({
            name: new FormControl("", [
                Validators.required,
                Validators.pattern("^[A-Za-z _-]+$"),
            ]),
            gstNumber: new FormControl("", Validators.required),
            legalEntity: new FormControl("", Validators.required),
            tdsNumber: new FormControl("", Validators.required),
            // registeredAddress: new FormControl("", Validators.required),
            bank_name: new FormControl("", Validators.required),
            bank_account_name: new FormControl("", Validators.required),
            bank_account_number: new FormControl("", Validators.required),
            bank_ifsc_code: new FormControl("", Validators.required),
            address_1: new FormControl("", Validators.required),
            state: new FormControl("", Validators.required),
            country: new FormControl("", Validators.required),
            city: new FormControl("", Validators.required),
            pincode: new FormControl("", Validators.required),
            address_2: new FormControl(""),
        });

        this.legalSubsidiaryForm = new FormGroup({
            name: new FormControl("", [
                Validators.required,
                Validators.pattern("^[A-Za-z _-]+$"),
            ]),
            gstNumber: new FormControl("", Validators.required),
            panNumber: new FormControl("", Validators.required),
            financialYear: new FormControl("", Validators.required),
            rocNumber: new FormControl("", Validators.required),
            tdsNumber: new FormControl("", Validators.required),
            registeredAddress: new FormControl("", Validators.required),
            legalEntity: new FormControl("", Validators.required),
        });

        // this.editRepairForm = new FormGroup({
        //     editRepairChecklist: new FormControl("", Validators.required),
        // });

        this.updatedLegalEntityForm = new FormGroup({
            name: new FormControl("", [
                Validators.required,
                Validators.pattern("^[A-Za-z _-]+$"),
            ]),
            gstNumber: new FormControl("", Validators.required),
            panNumber: new FormControl("", Validators.required),
            financialYear: new FormControl("", Validators.required),
            rocNumber: new FormControl("", Validators.required),
            tdsNumber: new FormControl("", Validators.required),
            // registeredAddress: new FormControl("", Validators.required),
            updateSelectedBranch: new FormControl(""),
            updateSelectedSubsidiaries: new FormControl(""),

            bank_name: new FormControl("", Validators.required),
            bank_account_name: new FormControl("", Validators.required),
            bank_account_number: new FormControl("", Validators.required),
            bank_ifsc_code: new FormControl("", Validators.required),
            address_1: new FormControl("", Validators.required),
            state: new FormControl("", Validators.required),
            country: new FormControl("", Validators.required),
            city: new FormControl("", Validators.required),
            pincode: new FormControl("", Validators.required),
            address_2: new FormControl(""),
        });

        this.updatedLegalBranchForm = new FormGroup({
            name: new FormControl("", [
                Validators.required,
                Validators.pattern("^[A-Za-z _-]+$"),
            ]),
            gstNumber: new FormControl("", Validators.required),
            legalEntity: new FormControl("", Validators.required),
            tdsNumber: new FormControl("", Validators.required),
            // registeredAddress: new FormControl("", Validators.required),
            bank_name: new FormControl("", Validators.required),
            bank_account_name: new FormControl("", Validators.required),
            bank_account_number: new FormControl("", Validators.required),
            bank_ifsc_code: new FormControl("", Validators.required),
            address_1: new FormControl("", Validators.required),
            state: new FormControl("", Validators.required),
            country: new FormControl("", Validators.required),
            city: new FormControl("", Validators.required),
            pincode: new FormControl("", Validators.required),
            address_2: new FormControl(""),
        });

        this.updatedLegalSubsidiaryForm = new FormGroup({
            name: new FormControl("", [
                Validators.required,
                Validators.pattern("^[A-Za-z _-]+$"),
            ]),
            gstNumber: new FormControl("", Validators.required),
            panNumber: new FormControl("", Validators.required),
            financialYear: new FormControl("", Validators.required),
            rocNumber: new FormControl("", Validators.required),
            tdsNumber: new FormControl("", Validators.required),
            registeredAddress: new FormControl("", Validators.required),
            legalEntity: new FormControl("", Validators.required),
        });

        // this.editProblemForm = new FormGroup({
        //     editProblemDiagnosis: new FormControl(""),
        // });

        this.legalEntityObject.registered_address = {} as RegisteredAddress;
        this.updatedLegalEntityObject.registered_address =
            {} as RegisteredAddress;
        this.legalBranchObject.registered_address = {} as RegisteredAddress;
        this.updatedLegalBranchObject.registered_address =
            {} as RegisteredAddress;

        this.setTableSetting();
        this.setTableSettingTwo();
        this.setTableSettingStateAndCity();
        this.getCustomerCategory();

        // this.getCustomerCategory();
        this.getPredefinedByType("ZONE");
        this.getPredefinedByType("CITY-TYPE");
        this.getPredefinedByType("CITY");
        this.getPredefinedByType("STATE");
        this.getPredefinedByType("UNAVAILABILITY-REASON");
        this.getPredefinedByType("PARENT-GROUP");
        this.getPredefinedByType("OEM");
        this.getPredefinedByType("CURRENCY");
        this.getPredefinedByType("COUNTRY");
        // this.getUnavailability();
        this.getPredefinedByCount("ZONE");
        this.getPredefinedByCount("CITY-TYPE");
        this.getPredefinedByCount("CITY");
        this.getPredefinedByCount("STATE");
        this.getPredefinedByCount("COUNTRY");
        this.getPredefinedByCount("UNAVAILABILITY-REASON");
        this.getPredefinedByCount("PARENT-GROUP");
        this.getPredefinedByCount("OEM");
        this.getPredefinedByCount("CURRENCY");
        this.getProductType();
        this.getSlotTypeList();
        this.getProductCategoryCount();
        this.getProductTypeCount();
        this.getCustomerCategoryCount();
        this.getSlotTypeCount();

        this.getProductCategoryList();
        this.getRepairAndProblemList();
        this.getRepairChecklist();
        this.getProblemDiagnosislist();
        this.getLegalEntityList();
        this.getLegalBranchList();
        this.getLegalSubsidiaryList();

        this.getLegalEntityCount();
        this.getLegalBranchCount();
        this.getLegalSubsidiaryCount();
    }
    setTableSetting() {
        this.searchPlaceholder = "Customer Type";
        this.searchPlaceholderUnAvailability = "Unavailability Reason";
        this.searchPlaceholderSparePart = "Spare Part Type";
        this.searchPlaceholderSlotType = "Slot Name";
        this.searchPlaceholderCategory = "Category Name";
        this.searchPlaceholderProductOEM = "Product Name";
        this.searchPlaceholderEntityCurrency = "Currency Name";
        this.searchPlaceholderLegalEntity = "Entity Name";
        this.searchPlaceholderLegalBranch = "Branch Name";
        this.searchPlaceholderLegalSubsidiary = "Subsidiary Name";

        this.tableCategotySettingsEvent = {
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
            active: true,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: true,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: true,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: true,
            addProblemDiagnosis: true,
        };

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
            active: true,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: true,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: true,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: false,
        };

        this.tableSettingsCategory = {
            // tableFilter: false,
            add: false,
            action: true,
            filter: false,
            clear: false,
            export: false,
            paginate: false,
            delete: false,
            edit: true,
            view: true,
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
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: true,
        };

        this.tableSettingsRepairChecklist = {
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
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: false,
        };

        this.tableSettingsProblemDiagnosis = {
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
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: false,
        };

        this.tableSettingsProductType = {
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
            allowExportxl: true,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: false,
        };

        this.tableSettingsSlotType = {
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
            allowExportxl: true,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: false,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: false,
        };

        this.tableSettingsLegailEntity = {
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
            active: true,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: true,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: true,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
            addRepairChecklist: false,
        };

        this.tableColsEventForSlotType = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "slot_name",
                header: "Slot Name",
                fieldType: "text",
            },
            {
                field: "start_time",
                header: "Start Time",
                fieldType: "text",
            },
            {
                field: "end_time",
                header: "End Time",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForCustomerType = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "customer_type",
                header: "Value",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForProductCategory = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "product_category",
                header: "Category Name",
                fieldType: "text",
            },
            {
                field: "sops",
                header: "Repair Checklist",
                fieldType: "addRepairChecklist",
            },
            {
                field: "pss",
                header: "Problem Diagnosis",
                fieldType: "addProblemDiagnosis",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsRepairChecklist = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "remarks",
                header: "Repair Checklist",
                fieldType: "text",
                // fieldType: "nestedList",
            },
        ];

        this.tableColsProblemDiagnosis = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "remarks",
                header: "Problem Diagnosis",
                fieldType: "text",
                // fieldType: "nestedList",
            },
        ];

        this.tableColsEventForUnavailability = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "name",
                header: "Reason",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForProductType = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "product_type",
                header: "Value",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForProductOEM = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "name",
                header: "Product OEM",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForEntityCurrency = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "name",
                header: "Entity Currency",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForLegalEntity = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "name",
                header: "Name",
                fieldType: "text",
            },
            {
                field: "financial_year",
                header: "Financial Year",
                fieldType: "text",
            },
            {
                field: "gst_number",
                header: "GST Number",
                fieldType: "text",
            },
            {
                field: "pan_number",
                header: "PAN Number",
                fieldType: "text",
            },
            {
                field: "roc_number",
                header: "ROC Number",
                fieldType: "text",
            },
            {
                field: "tds_number",
                header: "TDS Number",
                fieldType: "text",
            },
            {
                field: "branches",
                header: "Branches",
                fieldType: "text",
            },
            {
                field: "subsidiaries",
                header: "Subsidiaries",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForLegalBranche = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "name",
                header: "Name",
                fieldType: "text",
            },
            {
                field: "gst_number",
                header: "GST Number",
                fieldType: "text",
            },
            {
                field: "tds_number",
                header: "TDS Number",
                fieldType: "text",
            },
            {
                field: "legal_entity",
                header: "Legal Entity",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForLegalSubsidiary = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "name",
                header: "Name",
                fieldType: "text",
            },
            {
                field: "financial_year",
                header: "Financial Year",
                fieldType: "text",
            },
            {
                field: "gst_number",
                header: "GST Number",
                fieldType: "text",
            },
            {
                field: "pan_number",
                header: "PAN Number",
                fieldType: "text",
            },
            {
                field: "roc_number",
                header: "ROC Number",
                fieldType: "text",
            },
            {
                field: "tds_number",
                header: "TDS Number",
                fieldType: "text",
            },
            {
                field: "legal_entity",
                header: "Legal Entity",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];
    }

    setTableSettingStateAndCity() {
        this.searchPlaceholderState = "State Name";
        this.searchPlaceholderCityTab = "City Name";
        this.tableSettingsEventStateAndCity = {
            // tableFilter: false,
            add: false,
            action: false,
            filter: false,
            clear: false,
            export: false,
            paginate: true,
            delete: false,
            edit: false,
            view: false,
            active: true,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: true,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: true,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
        };
        this.tableColsEventForLocation = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "name",
                header: "Value",
                fieldType: "text",
            },
            // {
            //     field: "status",
            //     header: "Status",
            //     fieldType: "text",
            // },
        ];

        this.tableColsEventForCityTab = [
            { field: "index", header: "Sr.No", fieldType: "index" },

            {
                field: "parent",
                subfield: "name",
                header: "State",
                fieldType: "nestedData",
            },
            {
                field: "name",
                header: "City",
                fieldType: "text",
            },
        ];
    }

    setTableSettingTwo() {
        this.searchPlaceholderCity = "City Type";
        this.searchPlaceholderZone = "Zone Name";
        this.searchPlaceholderParent = "Parent Group";
        this.tableSettingsEventTwo = {
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
            active: true,
            deactive: false,
            activeDeactives: false,
            allowExport: false,
            allowExportxl: true,
            addClient: false,
            createOrder: false,
            addCatelog: false,
            search: true,
            addSparePart: false,
            addServicePerson: false,
            addOrderDetails: false,
            addOrderDetailsOnDemand: false,
            addOrderDetailsSparePart: false,
        };

        this.tableColsEventForCity = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "name",
                header: "Value",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForZone = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "name",
                header: "Value",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];

        this.tableColsEventForParent = [
            { field: "index", header: "Sr.No", fieldType: "index" },
            {
                field: "code",
                header: "Parent Code",
                fieldType: "text",
            },
            {
                field: "name",
                header: "Parent Group",
                fieldType: "text",
            },
            {
                field: "status",
                header: "Status",
                fieldType: "text",
            },
        ];
    }

    backToLandingPageOfProduct() {
        this.backToProductCategory = false;
        this.editEntityEventForProductCategory = false;
    }

    closeEventDialog() {
        // this.openEditDialogModuleEventForProductCategory = false;
        // this.editDialogBoxForCustomerCategory = false;
        // this.editDialogModuleForState = false;
        // this.editDialogModuleForCity = false;
        // this.editDialogModuleForZone = false;
    }

    closeProductEventDialog() {
        this.openEditDialogModuleEventForProductCategory = false;
    }

    closeCustomerEventDialog() {
        this.editDialogBoxForCustomerCategory = false;
        this.getCustomerCategory();
    }

    closeProductTypeEventDialog() {
        this.editDialogBoxForProductType = false;
        this.getProductType();
    }

    closeSlotTypeEventDialog() {
        this.editDialogBoxForSlotType = false;
        this.getSlotTypeList();
    }

    closeRepairCheclistDialog() {
        this.openDialogBoxForRepairCheclist = false;
        this.getProductCategoryList();
    }

    closeProblemDiagnosisDialog() {
        this.openDialogBoxForProblemDiagnosis = false;
        this.getProductCategoryList();
    }

    closeUpdateRepairCheclistDialog() {
        this.openEditDialogModuleRepairCheclist = false;
    }

    closeUpdateProblemDiagnosisDialog() {
        this.editDialogModuleProblemDiagnosisEvent = false;
    }

    closeCategoryNameDialog() {
        this.openEditDialogModuleCategoryName = false;
    }

    closeStateEventDialog() {
        this.editDialogModuleForState = false;
        this.getPredefinedByType("STATE");
    }

    closeCityEventDialog() {
        this.editDialogModuleForCity = false;
        this.getPredefinedByType("CITY-TYPE");
    }

    closeZoneEventDialog() {
        this.editDialogModuleForZone = false;
        this.getPredefinedByType("ZONE");
    }

    closeAvailabilityEventDialog() {
        this.editDialogModuleForUnAvailability = false;
        this.getPredefinedByType("UNAVAILABILITY-REASON");
    }

    closeOEMEventDialog() {
        this.editDialogModuleForProductOEM = false;
        this.getPredefinedByType("UNAVAILABILITY-REASON");
    }

    closeCurrencyEventDialog() {
        this.editDialogModuleForEntityCurrency = false;
        this.getPredefinedByType("CURRENCY");
    }

    closeCityTabEventDialog() {
        this.editDialogBoxForCityTab = false;
        this.getPredefinedByType("CITY");
    }

    closeLegalEntityEventDialog() {
        this.editDialogBoxForLegalEntity = false;
        this.getLegalEntityList();
    }

    closeLegalBranchEventDialog() {
        this.editDialogBoxForLegalBranch = false;
        this.getLegalBranchList();
    }

    closeLegalSubsidiaryEventDialog() {
        this.editDialogBoxForLegalSubsidiary = false;
        this.getLegalSubsidiaryList();
    }

    paginateEventForZone(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("ZONE");
    }

    paginateEventForCityType(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("CITY-TYPE");
    }

    paginateEventForCity(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("CITY");
    }

    paginateEventForState(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("STATE");
    }

    paginateEventForUnavailability(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("UNAVAILABILITY-REASON");
    }

    paginateEventForParent(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("PARENT-GROUP");
    }

    paginateEventForOEM(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("OEM");
    }

    paginateEventForCurrency(event) {
        this.pageSize = event.rows;
        this.predefineObject.page_number = event.page + 1;
        this.predefineObject.page_size = this.pageSize;
        this.getPredefinedByType("CURRENCY");
    }

    paginateEventForEntity(event) {
        this.pageSize = event.rows;
        this.legalEntityObject.page = event.page + 1;
        this.legalEntityObject.per_page = this.pageSize;
        this.getLegalEntityList();
    }

    paginateEventForBranch(event) {
        this.pageSize = event.rows;
        this.legalBranchObject.page = event.page + 1;
        this.legalBranchObject.per_page = this.pageSize;
        this.getLegalBranchList();
    }

    paginateEventForSubsidiary(event) {
        this.pageSize = event.rows;
        this.legalSubsidiaryObject.page = event.page + 1;
        this.legalSubsidiaryObject.per_page = this.pageSize;
        this.getLegalSubsidiaryList();
    }

    paginateEventForProductCategory(event) {
        this.pageSize = event.rows;
        this.productCategory.page = event.page + 1;
        this.productCategory.per_page = this.pageSize;
        this.getProductCategoryList();
    }

    paginateEventForSparePart(event) {
        this.pageSize = event.rows;
        this.sparePartManagerObject.page = event.page + 1;
        this.sparePartManagerObject.per_page = this.pageSize;
        this.getProductType();
    }

    paginateEventForCustomerType(event) {
        this.pageSize = event.rows;
        this.selectedCustomerType.page = event.page + 1;
        this.selectedCustomerType.per_page = this.pageSize;
        this.getCustomerCategory();
    }

    paginateEventForTimeSlot(event) {
        this.pageSize = event.rows;
        this.slotManagerObject.page = event.page + 1;
        this.slotManagerObject.per_page = this.pageSize;
        this.getSlotTypeList();
    }

    paginateEvent(event) {
        // this.pageSize = event.rows;
    }

    addEvent() {
        // this.titleEVent="Add Product";
        // this.product = new ProductMaster();
        // this.openAddDialogModuleEvent=true;
        // this.hideButtonView=true;
    }

    searchCustomerType($event) {
        this.selectedCustomerType.search_by = $event;
        this.getCustomerCategory();
    }

    searchStateType($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("STATE");
    }

    searchCityType($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("CITY-TYPE");
    }

    searchZoneType($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("ZONE");
    }

    searchProductOEM($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("OEM");
    }

    searchProductCurrency($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("CURRENCY");
    }

    searchParentGroup($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("PARENT-GROUP");
    }

    searchUnAvailability($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("UNAVAILABILITY-REASON");
    }

    searchSparePartType($event) {
        this.sparePartManagerObject.search_by = $event;
        this.getProductType();
    }

    searchCityTab($event) {
        this.predefineObject.search_by = $event;
        this.getPredefinedByType("CITY");
    }

    searchSlotType($event) {
        this.serachSlotObject.slot_name = $event;
        this.getSlotTypeList();
    }

    searchLegalEntity($event) {
        this.legalEntityObject.search_by = $event;
        this.getLegalEntityList();
    }

    searchLegalBranch($event) {
        this.legalBranchObject.search_by = $event;
        this.getLegalBranchList();
    }

    searchLegalSubsidiary($event) {
        this.legalSubsidiaryObject.search_by = $event;
        this.getLegalSubsidiaryList();
    }

    deleteEvent(event) {}

    activeEntity($event) {}
    openSidebar() {
        this.visibleSidebar = true;
        // this.getProductList();
    }

    getExportCustomerTypeName(): string {
        return "Customer Type List";
    }

    getExportStateName(): string {
        return "State List";
    }

    getExportParentGroup(): string {
        return "Parent Group";
    }

    getExportCityTypeName(): string {
        return "City Type List";
    }

    getExportZoneName(): string {
        return "Zone List";
    }

    getExportProductCategoryName(): string {
        return "Product Category List";
    }

    getExportUnavaliabilityReasonName(): string {
        return "Unavaliability Reason List";
    }

    getExportProductOEMName(): string {
        return "Product OEM List";
    }

    getExportEntityCurrencyName(): string {
        return "Entity Currency List";
    }

    getExportSparePartTypeName(): string {
        return "Spare Part Type List";
    }

    getExportCityTabName(): string {
        return "City List";
    }

    getExportSlotTabName(): string {
        return "Slot Tab List";
    }

    getExportEntityName(): string {
        return "Legal Entity List";
    }

    getExportBranchName(): string {
        return "Branch List";
    }

    getExportSubsidiaryName(): string {
        return "Subsidiary List";
    }

    deactiveEntity($event) {}

    saveEventDialog() {
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
    addSopField() {
        // if (this.sopValue === null) {
        this.sopFields.push(this.sopValue);
        this.sopValue = "";
        // } else {
        //     return;
        // }
    }

    addproblemStatementField() {
        this.problemStatementFields.push(this.posValue);
        this.posValue = "";
    }

    getCustomerCategory() {
        this.selectedCustomerType.search_by;
        this.customerService
            .getCustomerCategory(this.selectedCustomerType)
            .subscribe(
                (data: any) => {
                    // this.customerTypeList = data;

                    this.customerTypeList = data.map((item) => ({
                        ...item,
                        status: item.is_active === true ? "Active" : "Deactive",
                    }));
                },
                (err) => {
                    console.log(err, "Something wrong");
                }
            );
    }

    saveCustomerTypes(customer: CustomerCategory) {
        if (this.customerTypeForm.invalid) {
            this.customerTypeForm.markAllAsTouched(); // Highlight validation errors
            return;
        }

        this.customerService.saveCustomerType(customer).subscribe(
            (data) => {
                this.customerTypeForm.reset();
                this.getCustomerCategory();
                this.sweetAlertService.successAlert("Data added successfully!");
            },
            (err) => {
                // this.sweetAlertService.errorAlert("Something Went Wrong!");
                this.sweetAlertService.errorAlert(err.error.error);
            }
        );
    }

    getCustomerById() {
        if (!this.customerId) {
            return;
        }
        this.customerService.getCustomerById(this.customerId).subscribe(
            (data: any) => {
                this.customer = data;
                this.getCustomerCategory();
                this.getPredefinedByType("ZONE");
                this.getPredefinedByType("CITY-TYPE");
                this.getPredefinedByType("STATE");
                this.getPredefinedByType("CITY");
                this.getPredefinedByType("PARENT-GROUP");
                this.getPredefinedByType("UNAVAILABILITY-REASON");
                this.getPredefinedByType("OEM");
                this.getPredefinedByType("CURRENCY");

                console.log(this.customer, "Customer");
            },
            (err) => {
                console.log(err, "ERR");
            }
        );
    }

    getPredefinedByType(type: string) {
        // let predefined = new PredefinedMaster();
        this.predefined.search_by = this.predefineObject.search_by;
        this.predefined.page_number = this.predefineObject.page_number;
        this.predefined.page_size = this.predefineObject.page_size;
        this.predefined.entity_type = type;
        if (type === "STATE") {
            this.predefined.alphabetical_order = true;
        }
        if (type === "CITY") {
            this.predefined.alphabetical_order = true;
        }
        this.predefinedService
            .getPredefinedByTypeAndCode(this.predefined)
            .subscribe((data: any) => {
                switch (type) {
                    case "ZONE":
                        // this.zoneList = data.data;
                        this.zoneList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));
                        if (this.customerId) {
                            this.selectedZone = this.zoneList.filter(
                                (zone: PredefinedMaster) =>
                                    zone.name === this.address.zone
                            )[0];
                        }
                        break;
                    case "CITY-TYPE":
                        // this.cityTypeList = data.data;
                        this.cityTypeList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));

                        if (this.customerId) {
                            this.selectedCityType = this.cityTypeList.filter(
                                (cityType: PredefinedMaster) =>
                                    cityType.name === this.address.city_type
                            )[0];
                        }
                        break;
                    case "STATE":
                        // this.stateList = data.data;
                        this.stateList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));
                        if (this.customerId) {
                            this.selectedState = this.stateList.filter(
                                (state: PredefinedMaster) =>
                                    state.name === this.address.state
                            )[0];
                        }
                        break;
                    case "CITY":
                        // this.cityList = data.data;
                        this.cityList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));
                        if (this.customerId) {
                            this.predefineObject = this.cityList.filter(
                                (city: PredefinedMaster) =>
                                    city.name === this.address.city
                            )[0];
                        }
                        break;
                    case "COUNTRY":
                        this.countryTypeList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));

                        // if (this.customerId) {
                        //     this.predefineObject = this.countryTypeList.filter(
                        //         (state: PredefinedMaster) =>
                        //             state.name === this.address.state
                        //     )[0];
                        // }
                        break;
                    case "PARENT-GROUP":
                        // this.parentGroupList = data.data;
                        this.parentGroupList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));
                        break;
                    case "OEM":
                        // this.ProductOEMList = data.data;
                        this.ProductOEMList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));
                        break;
                    case "CURRENCY":
                        // this.currencyList = data.data;
                        this.currencyList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));
                        break;
                    case "UNAVAILABILITY-REASON":
                        // this.unAvailabilityTypeList = data.data;
                        this.unAvailabilityTypeList = data.data.map((item) => ({
                            ...item,
                            status:
                                item.is_active === true ? "Active" : "Deactive",
                        }));
                        break;

                    default:
                        break;
                }
            });
    }

    getProductCategoryList() {
        this.productService
            .getSettingProductCategoryList(this.productCategory)
            .subscribe(
                (data: any) => {
                    // this.productCategoryList = data;
                    this.productCategoryList = data.map((item: any) => ({
                        ...item,
                        status: item.is_active === true ? "Active" : "Deactive",
                        sops: this.formatAsList(item.sops),
                        pss: this.formatAsList(item.pss),
                    }));
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    // formatAsList(arr: string[]): string {
    //     if (!arr || arr.length === 0) return "";
    //     return arr.map((item) => `• ${item}`).join("\n");
    // }

    formatAsList(arr: string[] | null | undefined): string {
        if (!arr || arr.length === 0) return "";
        return (arr ?? []).map((item) => `• ${item}`).join("\n");
    }

    getRepairAndProblemList() {
        this.categoryRepairChecklistObj.product_category_uuid =
            this.categoryRepairChecklistObj.uuid;

        this.categoryRepairChecklistObj.uuid = undefined;
        this.categoryRepairChecklistObj.sops = undefined;
        this.categoryRepairChecklistObj.pss = undefined;
        this.categoryRepairChecklistObj.product_category = undefined;
        this.categoryRepairChecklistObj.is_active = undefined;
        this.categoryRepairChecklistObj.is_delete = undefined;
        this.categoryRepairChecklistObj.created_at = undefined;
        this.categoryRepairChecklistObj.created_by = undefined;
        this.categoryRepairChecklistObj.modified_at = undefined;
        this.categoryRepairChecklistObj.modified_by = undefined;
        this.productService
            .getRepairAndProblemList(this.categoryRepairChecklistObj)
            .subscribe(
                (data: any) => {
                    this.repaiChecklistList = [];
                    this.repaiProblemDiagnosis = [];
                    data.forEach((item) => {
                        if (item.is_ps_sop === 2) {
                            this.repaiChecklistList.push(item);
                        } else if (item.is_ps_sop === 1) {
                            this.repaiProblemDiagnosis.push(item);
                        }
                    });
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getRepairChecklist() {
        this.productService
            .getRepairAndProblemList(this.categoryRepairChecklistObj)
            .subscribe(
                (data: any) => {
                    this.repaiChecklistList = data.filter(
                        (item) => item.is_ps_sop === 2
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getProblemDiagnosislist() {
        this.productService
            .getRepairAndProblemList(this.categoryRepairChecklistObj)
            .subscribe(
                (data: any) => {
                    this.repaiProblemDiagnosis = data.filter(
                        (item) => item.is_ps_sop === 1
                    );
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getProductCategoryUuidList(uuid: string) {
        this.productService.getProductCategoryUuidList(uuid).subscribe(
            (data: any) => {
                this.productCategoryUuidList = [];
                this.productCategoryUuidList.push(data);

                console.log("Product Uuid List", this.productCategoryUuidList);
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    editProductCategory(category: ProductCategory) {
        this.editEntityEventForProductCategory = true;
        this.backToProductCategory = true;
        this.getProductCategoryUuidList(category.uuid);
    }

    saveProductCategory() {
        if (this.productCategoryForm.invalid) {
            this.productCategoryForm.markAllAsTouched(); // Highlight validation errors
            return;
        }
        this.productService
            .saveProductCategory(this.productCategoryObject)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );
                    this.getProductCategoryList();
                    this.productCategoryForm.reset();
                },
                (err) => {
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.sweetAlertService.errorAlert(err.error.error);
                }
            );
    }

    updateRepairAndProblem() {
        // this.editRepairForm.markAllAsTouched();
        // this.editProblemForm.markAllAsTouched();
        // if (!this.editRepairForm.valid) {
        //     return;
        // }
        // if (!this.editProblemForm.valid) {
        //     return;
        // }
        if (
            this.updateRepairAndProblemObj.sops_string != "" &&
            this.updateRepairAndProblemObj.sops_string != undefined &&
            this.updateRepairAndProblemObj.sops_string != null
        ) {
            this.updateRepairAndProblemObj.is_ps_sop = 2;
            this.updateRepairAndProblemObj.remarks =
                this.updateRepairAndProblemObj.sops_string;
        }

        if (
            this.updateRepairAndProblemObj.pss_string != "" &&
            this.updateRepairAndProblemObj.pss_string != undefined &&
            this.updateRepairAndProblemObj.pss_string != null
        ) {
            this.updateRepairAndProblemObj.is_ps_sop = 1;
            this.updateRepairAndProblemObj.remarks =
                this.updateRepairAndProblemObj.pss_string;
        }

        this.updateRepairAndProblemObj.sops_string = undefined;
        this.updateRepairAndProblemObj.pss_string = undefined;
        this.updateRepairAndProblemObj.sops = undefined;
        this.updateRepairAndProblemObj.pss = undefined;
        this.updateRepairAndProblemObj.product_category = undefined;
        this.updateRepairAndProblemObj.is_active = undefined;
        this.updateRepairAndProblemObj.is_delete = undefined;
        this.updateRepairAndProblemObj.created_at = undefined;
        this.updateRepairAndProblemObj.created_by = undefined;
        this.updateRepairAndProblemObj.modified_at = undefined;
        this.updateRepairAndProblemObj.modified_by = undefined;

        this.productService
            .saveRepairAndProblem(
                this.updateRepairAndProblemObj.uuid,
                this.updateRepairAndProblemObj
            )
            .subscribe(
                (data) => {
                    // this.sweetAlertService.successAlert(
                    //     "Data added successfully!"
                    // );
                    this.getProductCategoryList();
                    this.categoryRepairChecklistObj.sops_string = "";
                    this.openEditDialogModuleRepairCheclist = false;
                    this.editDialogModuleProblemDiagnosisEvent = false;
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    editProductCategoryEvent(productCategory: ProductCategory) {
        this.updatedProductCategoryName = productCategory;
        this.updatedProductCategoryName.product_category =
            productCategory.product_category;
        this.openEditDialogModuleCategoryName = true;
    }

    openDialogBoxForCategoryRepair(repairChecklist: ProductCategory) {
        this.productCategoryObject.sops_string = "";
        this.categoryRepairChecklistObj = repairChecklist;
        this.openDialogBoxForRepairCheclist = true;
        this.getRepairAndProblemList();
    }

    openDialogBoxForCategoryProblem(problemDiagnosis: ProductCategory) {
        this.productCategoryObject.pss_string = "";
        this.categoryRepairChecklistObj = problemDiagnosis;
        this.openDialogBoxForProblemDiagnosis = true;
        this.getRepairAndProblemList();
    }

    editRepairChecklistEvent(productCategory: ProductCategory) {
        this.updateRepairAndProblemObj = productCategory;
        this.updateRepairAndProblemObj.sops_string = productCategory.remarks;
        this.openEditDialogModuleRepairCheclist = true;
    }

    editProblemDiagnosisEvent(productCategory: ProductCategory) {
        this.updateRepairAndProblemObj = productCategory;
        this.updateRepairAndProblemObj.pss_string = productCategory.remarks;
        this.editDialogModuleProblemDiagnosisEvent = true;
    }

    updateProductCategory() {
        this.categoryNameForm.markAllAsTouched();
        if (!this.categoryNameForm.valid) {
            return;
        }

        this.updatedProductCategoryName.product_category =
            this.updatedProductCategoryName?.product_category;
        this.updatedProductCategoryName.sops = undefined;
        this.updatedProductCategoryName.pss = undefined;
        this.productService
            .updateProductCategory(
                this.updatedProductCategoryName.uuid,
                this.updatedProductCategoryName
            )
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.openEditDialogModuleCategoryName = false;
                },
                (err) => {
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.sweetAlertService.errorAlert(err.error.error);
                }
            );
    }

    updateAddRepairChecklist() {
        this.repairChecklistForm.markAllAsTouched();
        if (!this.repairChecklistForm.valid) {
            return;
        }
        this.categoryRepairChecklistObj.sops = [];
        this.categoryRepairChecklistObj.sops.push(
            this.productCategoryObject?.sops_string
        );

        this.categoryRepairChecklistObj.product_category = undefined;
        this.categoryRepairChecklistObj.pss = undefined;

        this.productService
            .updateProductCategory(
                this.categoryRepairChecklistObj.product_category_uuid,
                this.categoryRepairChecklistObj
            )
            .subscribe(
                (data) => {
                    // this.sweetAlertService.successAlert(
                    //     "Data updated successfully!"
                    // );
                    this.getRepairChecklist();
                    this.repairChecklistForm.reset();
                    // this.openDialogBoxForRepairCheclist = false;
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    updateProblemStatement() {
        this.problemStatementForm.markAllAsTouched();
        if (!this.problemStatementForm.valid) {
            return;
        }
        this.categoryRepairChecklistObj.pss = [];
        this.categoryRepairChecklistObj.pss.push(
            this.productCategoryObject?.pss_string
        );

        this.categoryRepairChecklistObj.product_category = undefined;
        this.categoryRepairChecklistObj.sops = undefined;
        this.productService
            .updateProductCategory(
                this.categoryRepairChecklistObj.product_category_uuid,
                this.categoryRepairChecklistObj
            )
            .subscribe(
                (data) => {
                    // this.sweetAlertService.successAlert(
                    //     "Data updated successfully!"
                    // );
                    this.getProblemDiagnosislist();
                    this.problemStatementForm.reset();
                    // this.openDialogBoxForProblemDiagnosis = false;
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    openDialogueCustomerCategory(customer: CustomerCategory) {
        this.editDialogBoxForCustomerCategory = true;
        this.updateCustomerType = customer;
    }

    updateCustomerCategory(customer: CustomerCategory) {
        this.updatedForms.markAllAsTouched();
        if (!this.updatedForms.valid) {
            return;
        }
        this.editDialogBoxForCustomerCategory = false;
        this.customerService
            .updateCustomerCategory(customer.uuid, customer)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                },
                (err) => {
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.sweetAlertService.errorAlert(err.error.error);
                }
            );
    }

    openDialoguePredefineForState(predefined: PredefinedMaster) {
        this.editDialogModuleForState = true;
        this.updatedPredefineObject = predefined;
    }

    openDialoguePredefineForCity(predefined: PredefinedMaster) {
        this.editDialogModuleForCity = true;
        this.updatedPredefineObject = predefined;
    }

    openDialoguePredefineForZone(predefined: PredefinedMaster) {
        this.editDialogModuleForZone = true;
        this.updatedPredefineObject = predefined;
    }

    openDialoguePredefineForParentGroup(predefined: PredefinedMaster) {
        this.editDialogModuleForParentGroup = true;
        this.updatedPredefineObject = predefined;
    }

    openDialoguePredefineForUnAvailability(predefined: PredefinedMaster) {
        this.editDialogModuleForUnAvailability = true;
        this.updatedPredefineObject = predefined;
    }

    openDialoguePredefineForProductOEM(predefined: PredefinedMaster) {
        this.editDialogModuleForProductOEM = true;
        this.updatedPredefineObject = predefined;
    }

    openDialoguePredefineForEntityCurrency(predefined: PredefinedMaster) {
        this.editDialogModuleForEntityCurrency = true;
        this.updatedPredefineObject = predefined;
    }

    openDialoguePredefineForSparePart(sparePart: SparePartManager) {
        this.editDialogBoxForProductType = true;
        this.updateSparePartObject = sparePart;
    }

    openDialoguePredefineForCityTab(predefined: PredefinedMaster) {
        this.editDialogBoxForCityTab = true;
        this.updatedPredefineObject = predefined;
        this.updatedSelectedState = this.stateList?.find(
            (item) => item?.name === this.updatedPredefineObject?.parent?.name
        );
    }

    openDialogueForLegalEntity(legal: LegalEntity) {
        this.editDialogBoxForLegalEntity = true;

        this.updatedLegalEntityObject = legal;

        this.updateSelectedBranch = this.legalBranchList.filter((item) =>
            this.updatedLegalEntityObject.branches.includes(item.name)
        );

        this.updateSelectedSubsidiaries = this.legalSubsidiaryList.filter(
            (item) =>
                this.updatedLegalEntityObject.subsidiaries.includes(item.name)
        );

        this.updatedLegalCountry = this.countryTypeList.find(
            (item) =>
                item.name ===
                this.updatedLegalEntityObject.registered_address.country
        );

        this.updatedLegalState = this.stateList.find(
            (item) =>
                item.name ===
                this.updatedLegalEntityObject.registered_address.state
        );

        this.updatedLegalCity = this.cityList.find(
            (item) =>
                item.name ===
                this.updatedLegalEntityObject.registered_address.city
        );
    }

    openDialogueForLegalBranch(branch: LegalBranch) {
        this.editDialogBoxForLegalBranch = true;
        this.updatedLegalBranchObject = branch;
        this.updateSelectedEntity = this.legalEntityList?.find(
            (item) => item?.name === this.updatedLegalBranchObject?.legal_entity
        );

        this.updatedLegalCountry = this.countryTypeList.find(
            (item) =>
                item.name ===
                this.updatedLegalBranchObject.registered_address.country
        );

        this.updatedLegalState = this.stateList.find(
            (item) =>
                item.name ===
                this.updatedLegalBranchObject.registered_address.state
        );

        this.updatedLegalCity = this.cityList.find(
            (item) =>
                item.name ===
                this.updatedLegalBranchObject.registered_address.city
        );
    }

    openDialogueForLegalSubsidiary(subsidiary: LegalSubsidiary) {
        this.editDialogBoxForLegalSubsidiary = true;
        this.updatedLegalSubsidiaryObject = subsidiary;
        this.updateSelectedEntity = this.legalEntityList?.find(
            (item) =>
                item?.name === this.updatedLegalSubsidiaryObject?.legal_entity
        );
    }

    openDialogueForSlotType(slot: SlotMaster) {
        this.editDialogBoxForSlotType = true;
        this.updateSlotObject = slot;

        let temp = "2022-07-01 ";
        temp += this.updateSlotObject.start_time;

        let date = new Date(temp);

        this.updateStartTimeDate = date;

        let tempTwo = "2022-07-01 ";
        tempTwo += this.updateSlotObject.end_time;

        let dateTwo = new Date(tempTwo);

        this.updateEndTimeDate = dateTwo;
    }

    resetCustomerType() {
        this.selectedCustomerType.customer_type = "";
    }

    resetStateType() {
        this.selectedStateValue.name = "";
    }

    resetCityType() {
        this.selectedCityType.name = "";
    }

    resetZoneType() {
        this.selectedZone.name = "";
    }

    resetParentGroup() {
        this.selectedParentGroup.name = "";
        this.selectedParentGroup.code = "";
    }

    resetUnAvailability() {
        this.selectedUnavailabity.name = "";
    }

    resetProductOEM() {
        this.selectedProductOEM.name = "";
    }

    resetEntityCurrency() {
        this.selectedEntityCurrency.name = "";
    }

    resetProductCategory() {
        this.productCategoryObject.product_category = "";
    }

    resetSparePartType() {
        this.sparePartManagerObject.product_type = "";
    }

    resetCityTab() {
        this.selectedState = {} as PredefinedMaster;
        this.predefineObject.name = "";
        this.selectedCityTabName.name = "";
    }

    resetSlotType() {
        this.slotManagerObject.slot_name = "";
        this.selectedStartTimeDate = undefined;
        this.selectedEndTimeDate = undefined;
    }

    resetLegalEntity() {
        this.legalEntityObject = {} as LegalEntity;
        this.legalEntityObject.registered_address = {} as RegisteredAddress;
        this.selectedLegalBranch = [];
        this.selectedLegalSubsidiaries = [];
        this.selectedCountry = {} as PredefinedMaster;
        this.selectedState = {} as PredefinedMaster;
        this.selectedLegalCity = {} as PredefinedMaster;
        this.imageSrc = null;
        this.uploadImagePath = null;
        if (this.fileUpload) {
            this.fileUpload.clear();
        }
    }

    resetLegalBranch() {
        this.legalBranchObject = {} as LegalBranch;
        this.selectedLegalEntity = {} as LegalEntity;
        this.legalBranchObject.registered_address = {} as RegisteredAddress;
        this.selectedCountry = {} as PredefinedMaster;
        this.selectedState = {} as PredefinedMaster;
        this.selectedLegalCity = {} as PredefinedMaster;
        this.imageSrc = null;
        this.uploadImagePath = null;
        if (this.fileUploadTwo) {
            this.fileUploadTwo.clear();
        }
    }

    resetLegalSubsidiary() {
        this.legalSubsidiaryObject = {} as LegalSubsidiary;
        this.selectedLegalEntity = {} as LegalEntity;
    }

    updatePredefine(type: string) {
        // this.updatedStateForms.markAllAsTouched();
        this.updatedCityForms.markAllAsTouched();
        this.updatedZoneForm.markAllAsTouched();
        this.updatedUnavailabilityForm.markAllAsTouched();
        // this.updatedStateForms.markAllAsTouched();
        this.updatedProductOEMForm.markAllAsTouched();
        this.updatedCurrencytForm.markAllAsTouched();
        if (
            // !this.updatedStateForms.valid &&
            !this.updatedCityForms.valid &&
            !this.updatedZoneForm.valid &&
            !this.updatedUnavailabilityForm.valid &&
            // !this.updatedStateForms.valid &&
            !this.updatedProductOEMForm.valid &&
            !this.updatedCurrencytForm.valid
        ) {
            return;
        }
        let fd = new FormData();
        this.updatedPredefineObject.field1 = undefined;
        this.updatedPredefineObject.field2 = undefined;
        this.updatedPredefineObject.field3 = undefined;
        this.updatedPredefineObject.is_delete = undefined;
        this.updatedPredefineObject.thumbnail = undefined;
        this.updatedPredefineObject.url = undefined;
        this.updatedPredefineObject.is_active = undefined;
        this.updatedPredefineObject.parent = undefined;

        this.updatedPredefineObject.code =
            this.updatedPredefineObject.name.toUpperCase();

        fd.append("data", JSON.stringify(this.updatedPredefineObject));

        this.editDialogModuleForState = false;
        this.editDialogModuleForCity = false;
        this.editDialogModuleForZone = false;
        this.editDialogModuleForUnAvailability = false;
        this.editDialogModuleForProductOEM = false;
        this.editDialogModuleForEntityCurrency = false;

        this.predefinedService
            .updatePredefined(this.updatedPredefineObject.uuid, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Value already exist!");
                    // this.sweetAlertService.errorAlert(err.error.message);
                }
            );
    }

    updatePredefineParentGroup(type: string) {
        this.updatedParentGroupForm.markAllAsTouched();
        if (!this.updatedParentGroupForm.valid) {
            return;
        }
        let fd = new FormData();
        this.updatedPredefineObject.field1 = undefined;
        this.updatedPredefineObject.field2 = undefined;
        this.updatedPredefineObject.field3 = undefined;
        this.updatedPredefineObject.is_delete = undefined;
        this.updatedPredefineObject.thumbnail = undefined;
        this.updatedPredefineObject.url = undefined;
        this.updatedPredefineObject.is_active = undefined;
        this.updatedPredefineObject.parent = undefined;

        this.updatedPredefineObject.code = this.updatedPredefineObject.code;

        fd.append("data", JSON.stringify(this.updatedPredefineObject));
        this.editDialogModuleForParentGroup = false;
        this.predefinedService
            .updatePredefined(this.updatedPredefineObject.uuid, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Value already exist!");
                    // this.sweetAlertService.errorAlert(err.error.message);
                }
            );
    }

    updatePredefineCityTab() {
        // this.updatedCityTabForm.markAllAsTouched();
        // if (!this.updatedCityTabForm.valid) {
        //     return;
        // }
        let fd = new FormData();
        this.updatedPredefineObject.entity_type = "CITY";

        this.updatedPredefineObject.parent_uuid =
            this.updatedSelectedState.uuid;

        this.updatedPredefineObject.code =
            this.updatedPredefineObject?.name.toUpperCase();

        this.updatedPredefineObject.name = this.updatedPredefineObject.name;

        this.updatedPredefineObject.field1 = undefined;
        this.updatedPredefineObject.field2 = undefined;
        this.updatedPredefineObject.field3 = undefined;
        this.updatedPredefineObject.is_delete = undefined;
        this.updatedPredefineObject.thumbnail = undefined;
        this.updatedPredefineObject.url = undefined;
        this.updatedPredefineObject.is_active = undefined;
        this.updatedPredefineObject.parent = undefined;

        fd.append("data", JSON.stringify(this.updatedPredefineObject));
        this.editDialogBoxForCityTab = false;

        this.predefinedService
            .updatePredefined(this.updatedPredefineObject.uuid, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                },
                (err) => {
                    this.sweetAlertService.errorAlert("Value already exist!");
                    // this.sweetAlertService.errorAlert(err.error.message);
                }
            );
    }

    saveUnavailability(entity_type: string) {
        switch (entity_type) {
            case "STATE":
                // if (this.stateForm.invalid) {
                //     this.stateForm.markAllAsTouched();
                //     return;
                // }
                this.predefineObject = this.selectedStateValue;
                this.predefineObject.code =
                    this.selectedStateValue.name.toUpperCase();
                break;
            case "CITY-TYPE":
                if (this.cityForm.invalid) {
                    this.cityForm.markAllAsTouched(); // Highlight validation errors
                    return;
                }

                this.predefineObject = this.selectedCityType;
                this.predefineObject.code =
                    this.selectedCityType.name.toUpperCase();
                break;
            case "ZONE":
                if (this.zoneForm.invalid) {
                    this.zoneForm.markAllAsTouched(); // Highlight validation errors
                    return;
                }

                this.predefineObject = this.selectedZone;
                this.predefineObject.code =
                    this.selectedZone.name.toUpperCase();
                break;
            case "PARENT-GROUP":
                if (this.parentGroupForm.invalid) {
                    this.parentGroupForm.markAllAsTouched(); // Highlight validation errors
                    return;
                }
                this.predefineObject = this.selectedParentGroup;
                this.predefineObject.code = this.selectedParentGroup.code;
                break;
            case "UNAVAILABILITY-REASON":
                if (this.unavailabilityForm.invalid) {
                    this.unavailabilityForm.markAllAsTouched(); // Highlight validation errors
                    return;
                }
                this.predefineObject = this.selectedUnavailabity;
                this.predefineObject.code =
                    this.selectedUnavailabity.name.toUpperCase();
                break;
            case "OEM":
                if (this.productOEMForm.invalid) {
                    this.productOEMForm.markAllAsTouched(); // Highlight validation errors
                    return;
                }
                this.predefineObject = this.selectedProductOEM;
                this.predefineObject.code =
                    this.selectedProductOEM.name.toUpperCase();
                break;
            case "CURRENCY":
                if (this.entityCurrencyForm.invalid) {
                    this.entityCurrencyForm.markAllAsTouched(); // Highlight validation errors
                    return;
                }
                this.predefineObject = this.selectedEntityCurrency;
                this.predefineObject.code =
                    this.selectedEntityCurrency.name.toUpperCase();
                break;
        }
        let fd = new FormData();
        this.predefineObject.entity_type = entity_type;
        fd.append("data", JSON.stringify(this.predefineObject));
        this.predefinedService.saveUnavailability(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.zoneForm.reset();
                // this.stateForm.reset();
                this.cityForm.reset();
                // this.cityTypeForm.reset();
                this.sparePartTypeForm.reset();
                this.slotTypeForm.reset();
                this.parentGroupForm.reset();
                this.customerTypeForm.reset();
                this.unavailabilityForm.reset();
                this.productOEMForm.reset();
                this.entityCurrencyForm.reset();

                // this.selectedStateValue = {} as PredefinedMaster;
                // this.selectedCityType = {} as PredefinedMaster;
                // this.selectedZone = {} as PredefinedMaster;
                // this.selectedParentGroup = {} as PredefinedMaster;
                // this.selectedUnavailabity = {} as PredefinedMaster;
                // this.selectedProductOEM = {} as PredefinedMaster;
                // this.selectedEntityCurrency = {} as PredefinedMaster;
                this.getPredefinedByType("ZONE");
                this.getPredefinedByType("CITY-TYPE");
                this.getPredefinedByType("CITY");
                this.getPredefinedByType("STATE");
                this.getPredefinedByType("PARENT-GROUP");
                this.getPredefinedByType("UNAVAILABILITY-REASON");
                this.getPredefinedByType("OEM");
                this.getPredefinedByType("CURRENCY");
            },
            (err) => {
                this.sweetAlertService.errorAlert("Value already exist!");
                // this.sweetAlertService.errorAlert(err.error.message);
            }
        );
    }

    deleteCustomerCategory(event) {
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
                let delCustomer = this.customerCategoryObject;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.customerService
                    .deleteCustomerCategory(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getCustomerCategory();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getCustomerCategory();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactiveCustomerCategory(service: CustomerCategory) {
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
                    .statusForCustomerCategory(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Customer Type " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getCustomerCategory();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Customer Type " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getCustomerCategory();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    deletePredefinedEntityType(event) {
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
                let delPredefine = this.predefineObject;
                const predefinedId = event;
                delPredefine.uuid = predefinedId.uuid;
                this.predefinedService
                    .deletePredefinedEntityType(predefinedId.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getPredefinedByType("ZONE");
                            this.getPredefinedByType("CITY-TYPE");
                            this.getPredefinedByType("STATE");
                            this.getPredefinedByType("PARENT-GROUP");
                            this.getPredefinedByType("UNAVAILABILITY-REASON");
                            this.getPredefinedByType("CITY");
                            this.getPredefinedByType("OEM");
                            this.getPredefinedByType("CURRENCY");
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getPredefinedByType("ZONE");
                                    this.getPredefinedByType("CITY-TYPE");
                                    this.getPredefinedByType("STATE");
                                    this.getPredefinedByType("PARENT-GROUP");
                                    this.getPredefinedByType(
                                        "UNAVAILABILITY-REASON"
                                    );
                                    this.getPredefinedByType("CITY");
                                    this.getPredefinedByType("OEM");
                                    this.getPredefinedByType("CURRENCY");
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactiveCustomer(service: PredefinedMaster) {
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
                this.predefinedService
                    .statusForPredefined(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Value " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getPredefinedByType("ZONE");
                        this.getPredefinedByType("CITY-TYPE");
                        this.getPredefinedByType("STATE");
                        this.getPredefinedByType("PARENT-GROUP");
                        this.getPredefinedByType("UNAVAILABILITY-REASON");
                        this.getPredefinedByType("CITY");
                        this.getPredefinedByType("OEM");
                        this.getPredefinedByType("CURRENCY");

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Value " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getPredefinedByType("ZONE");
                                    this.getPredefinedByType("CITY-TYPE");
                                    this.getPredefinedByType("STATE");
                                    this.getPredefinedByType("PARENT-GROUP");
                                    this.getPredefinedByType(
                                        "UNAVAILABILITY-REASON"
                                    );
                                    this.getPredefinedByType("CITY");
                                    this.getPredefinedByType("OEM");
                                    this.getPredefinedByType("CURRENCY");
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    deleteProductCategory(event) {
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
                let delCustomer = this.productCategory;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.predefinedService
                    .deleteProductCategory(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getProductCategoryList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getProductCategoryList();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactiveProductCategory(service: ProductCategory) {
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
                this.predefinedService
                    .statusForProductCategory(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Product Category " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getProductCategoryList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Product Category " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getProductCategoryList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    activeDeactiveRepairChecklist(service: ProductCategory) {
        let deactiveActiveString: string;
        if (service.is_active == false) {
            deactiveActiveString = "Activate";
        } else if (service.is_active == true) {
            deactiveActiveString = "Deactivate";
        }
        this.openDialogBoxForRepairCheclist = false;
        this.openDialogBoxForProblemDiagnosis = false;
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
                this.predefinedService
                    .statusForRepairChecklist(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Product Category " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getRepairChecklist();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Product Category " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getRepairChecklist();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    activeDeactiveProblemDiagnosis(service: ProductCategory) {
        let deactiveActiveString: string;
        if (service.is_active == false) {
            deactiveActiveString = "Activate";
        } else if (service.is_active == true) {
            deactiveActiveString = "Deactivate";
        }
        this.openDialogBoxForRepairCheclist = false;
        this.openDialogBoxForProblemDiagnosis = false;
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
                this.predefinedService
                    .statusForProblemDiagnosis(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Product Category " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getProblemDiagnosislist();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Product Category " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getProblemDiagnosislist();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    getProductType() {
        this.serviceRequestService
            .getProductType(this.sparePartManagerObject)
            .subscribe(
                (data: any) => {
                    this.sparePartManagerList = data.map((item) => ({
                        ...item,
                        status: item.is_active === true ? "Active" : "Deactive",
                    }));
                },
                (err) => {
                    console.log(err, "Something wrong");
                }
            );
    }

    saveProductTypes() {
        this.sparePartTypeForm.markAllAsTouched();
        if (!this.sparePartTypeForm.valid) {
            return;
        }
        this.serviceRequestService
            .saveProductTypes(this.sparePartManagerObject)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );
                    this.sparePartTypeForm.reset();
                    this.getProductType();
                },
                (err) => {
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.sweetAlertService.errorAlert(err.error.error);
                }
            );
    }

    updateProductType(product: SparePartManager) {
        this.updatedSparePartForm.markAllAsTouched();

        if (!this.updatedSparePartForm.valid) {
            return;
        }
        this.serviceRequestService
            .updateProductType(product.uuid, product)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.editDialogBoxForProductType = false;
                },
                (err) => {
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.sweetAlertService.errorAlert(err.error.error);
                }
            );
    }

    deleteProductType(event) {
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
                let delCustomer = this.sparePartManagerObject;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.serviceRequestService
                    .deleteProductType(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getProductType();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getProductType();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactiveSparePart(service: SparePartManager) {
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
                this.serviceRequestService
                    .statusForProductType(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Spare Part Type " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getProductType();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Spare Part Type " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getProductType();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    // formatTime(date: Date): string {
    //     const hours = date.getHours();
    //     const minutes = date.getMinutes();

    //     const formattedTime = `${this.padZero(hours)}:${this.padZero(
    //         minutes
    //     )}:00`;

    //     return formattedTime;
    // }

    // padZero(num: number): string {
    //     return num < 10 ? "0" + num : num.toString();
    // }

    // if(event) {
    //     const timeString = this.formatTime(event);
    //     this.selectedStartTime = timeString;
    // }

    onStartDateChange(event: any): void {
        if (event) {
            this.selectedStartTime = this.formatStartTime(event);
            this.updatedEndTime = this.formatStartTime(event);
        }
    }

    onEndDateChange(event: any): void {
        if (event) {
            this.selectedEndTime = this.formatStartTime(event);
            this.updatedEndTime = this.formatStartTime(event);
        }
    }

    formatStartTime(date: Date): string {
        if (!date) return "";
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    getSlotTypeList() {
        this.slotManagerObject.slot_name = this.serachSlotObject?.slot_name;
        this.serviceRequestService
            .getSoltMaster(this.slotManagerObject)
            .subscribe(
                (data: any) => {
                    // this.slotManagerList = data;

                    this.slotManagerList = data.map((item) => ({
                        ...item,
                        status: item.is_active === true ? "Active" : "Deactive",
                    }));
                },
                (err) => {
                    console.log(err, "Something wrong");
                }
            );
    }

    saveSlotType() {
        if (this.slotTypeForm.invalid) {
            this.slotTypeForm.markAllAsTouched(); // Highlight validation errors
            return;
        }
        this.slotManagerObject.start_time = this.datePipe.transform(
            this.selectedStartTimeDate,
            "H:m:s"
        );

        this.slotManagerObject.end_time = this.datePipe.transform(
            this.selectedEndTimeDate,
            "H:m:s"
        );

        //  this.slotManagerObject.start_time = this.selectedStartTime;
        //  this.slotManagerObject.end_time = this.selectedEndTime;
        this.serviceRequestService
            .saveSoltMaster(this.slotManagerObject)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );
                    this.slotTypeForm.reset();
                    this.getSlotTypeList();
                },
                (err) => {
                    // this.sweetAlertService.errorAlert("Something Went Wrong!");
                    this.sweetAlertService.errorAlert(err.error.error);
                }
            );
    }

    updateSlotType(slot: SlotMaster) {
        this.updateSlotForm.markAllAsTouched();
        this.updateSlotTwoForm.markAllAsTouched();
        if (!this.updateSlotForm.valid && !this.updateSlotTwoForm.valid) {
            return;
        }

        slot.start_time = this.datePipe.transform(
            this.updateStartTimeDate,
            "H:m:s"
        );

        slot.end_time = this.datePipe.transform(
            this.updateEndTimeDate,
            "H:m:s"
        );

        // slot.start_time = this.updatedStartTime;
        // slot.end_time = this.updatedEndTime;
        // slot = this.updateSlotObject;
        this.serviceRequestService.updateSlotType(slot.uuid, slot).subscribe(
            (data) => {
                this.sweetAlertService.successAlert(
                    "Data updated successfully!"
                );
                this.editDialogBoxForSlotType = false;
            },
            (err) => {
                // this.sweetAlertService.errorAlert("Something Went Wrong!");
                this.sweetAlertService.errorAlert(err.error.error);
            }
        );
    }

    deleteSlotById(event) {
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
                let delCustomer = this.slotManagerObject;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.serviceRequestService
                    .deleteSlotById(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getSlotTypeList();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getSlotTypeList();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    activeDeactiveSlotType(service: SlotMaster) {
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
                this.serviceRequestService
                    .statusForSlotById(service.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Slot Type " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getSlotTypeList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Slot Type " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getSlotTypeList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    saveStateCityZone(entity_type: string) {
        // this.cityTypeForm.markAllAsTouched();
        // if (!this.cityTypeForm.valid) {
        //     return;
        // }
        // if (this.cityTypeForm.invalid) {
        //     this.cityTypeForm.markAllAsTouched();
        //     return;
        // }
        this.cityTabPredefineObject.entity_type = entity_type;

        this.cityTabPredefineObject.parent_uuid = this.selectedState.uuid;

        this.cityTabPredefineObject.code =
            this.selectedCityTabName.name.toUpperCase();

        this.cityTabPredefineObject.name = this.selectedCityTabName.name;

        let fd = new FormData();
        fd.append("data", JSON.stringify(this.cityTabPredefineObject));
        this.predefinedService.saveCityInMaster(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                // this.cityTypeForm.reset();
                this.getPredefinedByType("CITY");
            },
            (err) => {
                this.sweetAlertService.errorAlert("Value already exist!");
                // this.sweetAlertService.errorAlert(err.error.error);
            }
        );
    }

    deleteRepairAndProblem(event) {
        this.openDialogBoxForRepairCheclist = false;
        this.openDialogBoxForProblemDiagnosis = false;
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
                let delCustomer = this.updateRepairAndProblemObj;
                const customerId = event;
                delCustomer.uuid = customerId.uuid;
                this.productService
                    .deleteRepairAndProblem(delCustomer.uuid)
                    .subscribe(
                        (data) => {
                            Swal.fire(
                                "Deleted!",
                                "Data deleted successfully.",
                                "success"
                            );
                            this.getCustomerCategory();
                        },
                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire(
                                        "Deleted!",
                                        "Data deleted successfully.",
                                        "success"
                                    );
                                    this.getCustomerCategory();
                                } else {
                                }
                            }
                        }
                    );
            }
        });
    }

    getPredefinedByCount(type: string) {
        let predefined = new PredefinedMaster();
        predefined.entity_type = type;
        this.predefinedService
            .getPredefinedByCount(predefined)
            .subscribe((data: any) => {
                switch (type) {
                    case "ZONE":
                        this.totalRecordsForZone = data.count;
                        break;
                    case "CITY-TYPE":
                        this.totalRecordsForCityType = data.count;
                        break;
                    case "STATE":
                        this.totalRecordsForState = data.count;
                        break;

                    case "CITY":
                        this.totalRecordsForCity = data.count;
                        break;
                    case "PARENT-GROUP":
                        this.totalRecordsForParentGroup = data.count;
                        break;
                    case "OEM":
                        this.totalRecordsForOEM = data.count;
                        break;
                    case "CURRENCY":
                        this.totalRecordsForCurrency = data.count;
                        break;
                    case "UNAVAILABILITY-REASON":
                        this.totalRecordsForUnAvailability = data.count;
                        break;

                    default:
                        break;
                }
            });
    }

    getLegalEntityList() {
        this.legalEntityService
            .getLegalEntityList(this.legalEntityObject)
            .subscribe(
                (data: any) => {
                    this.legalEntityList = data.map((item) => ({
                        ...item,
                        status: item.is_active === true ? "Active" : "Deactive",
                        branches: item.branches?.length
                            ? item.branches.map((branch) => branch.name || "-")
                            : ["-"],
                        subsidiaries: item.subsidiaries?.length
                            ? item.subsidiaries.map((sub) => sub.name || "-")
                            : ["-"],
                    }));
                },
                (err) => {
                    console.log("Something went wrong:", err);
                }
            );
    }

    getLegalBranchList() {
        this.legalEntityService
            .getLegalBranchList(this.legalBranchObject)
            .subscribe(
                (data: any) => {
                    this.legalBranchList = data.map((item) => ({
                        ...item,
                        status: item.is_active === true ? "Active" : "Deactive",
                        legal_entity: item.legal_entity.name,
                    }));
                },
                (err) => {
                    console.log(err, "Something wrong");
                }
            );
    }

    getLegalSubsidiaryList() {
        this.legalEntityService
            .getLegalSubsidiaryList(this.legalSubsidiaryObject)
            .subscribe(
                (data: any) => {
                    this.legalSubsidiaryList = data.map((item) => ({
                        ...item,
                        status: item.is_active === true ? "Active" : "Deactive",
                        legal_entity: item.legal_entity.name,
                    }));
                },
                (err) => {
                    console.log(err, "Something wrong");
                }
            );
    }

    saveLegalEntity() {
        this.legalEntityForm.markAllAsTouched();
        if (!this.legalEntityForm.valid) {
            return;
        }

        this.legalEntityObject.branches_associated = [];
        this.selectedLegalBranch.forEach((cat: LegalEntity) => {
            this.legalEntityObject.branches_associated.push(cat.uuid);
        });

        this.legalEntityObject.subsidiary_associated = [];
        this.selectedLegalSubsidiaries.forEach((cat: LegalEntity) => {
            this.legalEntityObject.subsidiary_associated.push(cat.uuid);
        });

        this.legalEntityObject.registered_address.country =
            this.selectedCountry.name;
        this.legalEntityObject.registered_address.state =
            this.selectedState.name;
        this.legalEntityObject.registered_address.city =
            this.selectedLegalCity.name;

        let fd = new FormData();
        fd.append("sign_document", this.uploadImagePath);
        fd.append("data", JSON.stringify(this.legalEntityObject));

        this.legalEntityService.saveLegalEntity(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.legalEntityForm.reset();
                this.imageSrc = null;
                this.uploadImagePath = null;
                if (this.fileUpload) {
                    this.fileUpload.clear();
                }
                this.getLegalEntityList();
            },
            (err) => {
                if (err?.error?.message) {
                    this.sweetAlertService.errorAlert(err.error.message);
                    this.legalEntityForm.reset();
                    this.imageSrc = null;
                    this.uploadImagePath = null;
                    if (this.fileUpload) {
                        this.fileUpload.clear();
                    }
                } else {
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            }
        );
    }

    saveLegalBranch() {
        this.legalBrancheForm.markAllAsTouched();
        if (!this.legalBrancheForm.valid) {
            return;
        }

        this.legalBranchObject.legal_entity_uuid =
            this.selectedLegalEntity.uuid;

        this.legalBranchObject.registered_address.country =
            this.selectedCountry.name;
        this.legalBranchObject.registered_address.state =
            this.selectedState.name;
        this.legalBranchObject.registered_address.city =
            this.selectedLegalCity.name;

        let fd = new FormData();
        fd.append("sign_document", this.uploadImagePath);
        fd.append("data", JSON.stringify(this.legalBranchObject));

        this.legalEntityService.saveLegalBranch(fd).subscribe(
            (data) => {
                this.sweetAlertService.successAlert("Data added successfully!");
                this.legalBrancheForm.reset();
                this.imageSrc = null;
                this.uploadImagePath = null;
                if (this.fileUploadTwo) {
                    this.fileUploadTwo.clear();
                }
                this.getLegalBranchList();
            },
            (err) => {
                // this.sweetAlertService.errorAlert(err.error.error);
                this.sweetAlertService.errorAlert("Something Went Wrong!");
            }
        );
    }

    saveLegalSubsidiary() {
        this.legalSubsidiaryForm.markAllAsTouched();
        if (!this.legalSubsidiaryForm.valid) {
            return;
        }

        this.legalSubsidiaryObject.legal_entity_uuid =
            this.selectedLegalEntity.uuid;
        this.legalEntityService
            .saveLegalSubsidiary(this.legalSubsidiaryObject)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data added successfully!"
                    );
                    this.legalSubsidiaryForm.reset();
                    this.getLegalSubsidiaryList();
                },
                (err) => {
                    // this.sweetAlertService.errorAlert(err.error.error);
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    updateLegalEntity() {
        this.updatedLegalEntityForm.markAllAsTouched();
        if (!this.updatedLegalEntityForm.valid) {
            return;
        }

        this.updatedLegalEntityObject.branches_associated = [];
        this.updateSelectedBranch.forEach((cat: LegalEntity) => {
            this.updatedLegalEntityObject.branches_associated.push(cat.uuid);
        });

        this.updatedLegalEntityObject.subsidiary_associated = [];
        this.updateSelectedSubsidiaries.forEach((cat: LegalEntity) => {
            this.updatedLegalEntityObject.subsidiary_associated.push(cat.uuid);
        });

        this.updatedLegalEntityObject.registered_address.country =
            this.updatedLegalCountry.name;
        this.updatedLegalEntityObject.registered_address.state =
            this.updatedLegalState.name;
        this.updatedLegalEntityObject.registered_address.city =
            this.updatedLegalCity.name;

        this.updatedLegalEntityObject.branches = undefined;
        this.updatedLegalEntityObject.subsidiaries = undefined;
        this.updatedLegalEntityObject.modified_at = undefined;
        this.updatedLegalEntityObject.modified_by = undefined;
        this.updatedLegalEntityObject.is_active = undefined;
        this.updatedLegalEntityObject.is_delete = undefined;
        this.updatedLegalEntityObject.created_at = undefined;
        this.updatedLegalEntityObject.created_by = undefined;
        this.updatedLegalBranchObject.sign_document = undefined;

        let fd = new FormData();
        fd.append("sign_document", this.uploadImagePath);
        fd.append("data", JSON.stringify(this.updatedLegalEntityObject));

        this.legalEntityService
            .updateLegalEntity(this.updatedLegalEntityObject.uuid, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.editDialogBoxForLegalEntity = false;
                    this.getLegalSubsidiaryList();
                },
                (err) => {
                    // this.sweetAlertService.errorAlert(err.error.error);
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    updateLegalBranch() {
        this.updatedLegalBranchForm.markAllAsTouched();
        if (!this.updatedLegalBranchForm.valid) {
            return;
        }

        this.updatedLegalBranchObject.legal_entity_uuid =
            this.updateSelectedEntity.uuid;

        this.updatedLegalBranchObject.registered_address.country =
            this.updatedLegalCountry.name;
        this.updatedLegalBranchObject.registered_address.state =
            this.updatedLegalState.name;
        this.updatedLegalBranchObject.registered_address.city =
            this.updatedLegalCity.name;

        this.updatedLegalBranchObject.sign_document = undefined;
        this.updatedLegalBranchObject.legal_entity = undefined;
        this.updatedLegalBranchObject.modified_at = undefined;
        this.updatedLegalBranchObject.modified_by = undefined;
        this.updatedLegalBranchObject.is_active = undefined;
        this.updatedLegalBranchObject.is_delete = undefined;
        this.updatedLegalBranchObject.created_at = undefined;
        this.updatedLegalBranchObject.created_by = undefined;

        let fd = new FormData();
        fd.append("sign_document", this.uploadImagePath);
        fd.append("data", JSON.stringify(this.updatedLegalBranchObject));

        this.legalEntityService
            .updateLegalBranch(this.updatedLegalBranchObject.uuid, fd)
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.editDialogBoxForLegalBranch = false;
                    this.getLegalSubsidiaryList();
                },
                (err) => {
                    // this.sweetAlertService.errorAlert(err.error.error);
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    updateLegalSubsidiary() {
        this.updatedLegalSubsidiaryForm.markAllAsTouched();
        if (!this.updatedLegalSubsidiaryForm.valid) {
            return;
        }

        this.updatedLegalSubsidiaryObject.legal_entity_uuid =
            this.updateSelectedEntity.uuid;
        this.updatedLegalSubsidiaryObject.legal_entity = undefined;
        this.updatedLegalSubsidiaryObject.modified_at = undefined;
        this.updatedLegalSubsidiaryObject.modified_by = undefined;
        this.updatedLegalSubsidiaryObject.is_active = undefined;
        this.updatedLegalSubsidiaryObject.is_delete = undefined;
        this.updatedLegalSubsidiaryObject.created_at = undefined;
        this.updatedLegalSubsidiaryObject.created_by = undefined;

        this.legalEntityService
            .updateLegalSubsidiary(
                this.updatedLegalSubsidiaryObject.uuid,
                this.updatedLegalSubsidiaryObject
            )
            .subscribe(
                (data) => {
                    this.sweetAlertService.successAlert(
                        "Data updated successfully!"
                    );
                    this.editDialogBoxForLegalSubsidiary = false;
                    this.getLegalSubsidiaryList();
                },
                (err) => {
                    // this.sweetAlertService.errorAlert(err.error.error);
                    this.sweetAlertService.errorAlert("Something Went Wrong!");
                }
            );
    }

    activeDeactiveLegalEntity(legal: LegalEntity) {
        let deactiveActiveString: string;
        if (legal.is_active == false || "Active") {
            deactiveActiveString = "Deactivate";
        } else if (legal.is_active == true || "Deactivate") {
            deactiveActiveString = "Activate";
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
                this.legalEntityService
                    .activeDeactiveLegalEntity(legal.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Legal Entity " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getLegalEntityList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Legal Entity " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getLegalEntityList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    activeDeactiveLegalBranch(branch: LegalBranch) {
        let deactiveActiveString: string;
        if (branch.is_active == false || "Active") {
            deactiveActiveString = "Deactivate";
        } else if (branch.is_active == true || "") {
            deactiveActiveString = "Activate";
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
                this.legalEntityService
                    .activeDeactiveLegalBranch(branch.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Branch " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getLegalBranchList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Branch " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getLegalBranchList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    activeDeactiveLegalSubsidiary(subsidiary: LegalSubsidiary) {
        let deactiveActiveString: string;
        if (subsidiary.is_active == false || "Active") {
            deactiveActiveString = "Activate";
        } else if (subsidiary.is_active == true || "Deactivate") {
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
                this.legalEntityService
                    .activeDeactiveLegalSubsidiary(subsidiary.uuid)
                    .subscribe((data) => {
                        console.log(data, "datadata");

                        Swal.fire({
                            icon: "success",

                            title:
                                "Subsidiary " +
                                deactiveActiveString +
                                " successfully!",
                        });
                        this.getLegalSubsidiaryList();

                        (error) => {
                            if (error instanceof HttpErrorResponse) {
                                if (error.status === 200) {
                                    Swal.fire({
                                        icon: "success",

                                        title:
                                            "Subsidiary " +
                                            deactiveActiveString +
                                            " successfully!",
                                    });
                                    this.getLegalSubsidiaryList();
                                } else {
                                }
                            }
                        };
                    });
            }
        });
    }

    getLegalEntityCount() {
        this.legalEntityService
            .getLegalEntityCount(this.legalEntityObject)
            .subscribe(
                (data: any) => {
                    this.totalRecordsForLegalEntity = data.count;
                },
                (err) => {
                    console.log(err, "ERR");
                }
            );
    }

    getLegalBranchCount() {
        this.legalEntityService
            .getLegalBranchCount(this.legalBranchObject)
            .subscribe(
                (data: any) => {
                    this.totalRecordsForBranch = data.count;
                },
                (err) => {
                    console.log(err, "ERR");
                }
            );
    }

    getLegalSubsidiaryCount() {
        this.legalEntityService
            .getLegalSubsidiaryCount(this.legalSubsidiaryObject)
            .subscribe(
                (data: any) => {
                    this.totalRecordsForSubsidiary = data.count;
                },
                (err) => {
                    console.log(err, "ERR");
                }
            );
    }

    getProductCategoryCount() {
        this.productService.getProductCategoryCount().subscribe(
            (data: any) => {
                this.totalRecordsForProductCategory = data.count;
            },
            (err) => {
                console.log(err, "Error");
            }
        );
    }

    getProductTypeCount() {
        this.serviceRequestService
            .getProductTypeCount(this.sparePartManagerObject)
            .subscribe(
                (data: any) => {
                    this.totalRecordsForSparePart = data.count;
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getCustomerCategoryCount() {
        this.customerService
            .getCustomerCategoryCount(this.selectedCustomerType)
            .subscribe(
                (data: any) => {
                    this.totalRecordsForCustomerType = data.count;
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    getSlotTypeCount() {
        this.serviceRequestService
            .getSlotTypeCount(this.selectedCustomerType)
            .subscribe(
                (data: any) => {
                    this.totalRecordsForTimeSlot = data.count;
                },
                (err) => {
                    console.log(err, "Error");
                }
            );
    }

    uploadDocuments(event: any): void {
        const file = event.files[0]; // Get the first file
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            this.msg = "The file should be in JPEG, JPG, or PNG format";
            this.sweetAlertService.errorAlert(this.msg);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.msg = "File is too large. Over 5MB";
            this.sweetAlertService.errorAlert(this.msg);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                this.imageSrc = e.target.result as string;
            }
        };

        reader.readAsDataURL(file);
        this.uploadImagePath = file;
    }

    updateUploadDocuments(event: any): void {
        const file = event.files[0]; // Get the first file
        if (!file) return;

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            this.msg = "The file should be in JPEG, JPG, or PNG format";
            this.sweetAlertService.errorAlert(this.msg);
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.msg = "File is too large. Over 5MB";
            this.sweetAlertService.errorAlert(this.msg);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                this.updateImageSrc = e.target.result as string;
            }
        };

        reader.readAsDataURL(file);
        this.uploadImagePath = file;
    }

    deleteImgSrc(): void {
        this.imageSrc = null;
        this.updateImageSrc = null;
        this.uploadImagePath = null;
        if (this.updatedLegalEntityObject.sign_document) {
            this.updatedLegalEntityObject.sign_document.file_path = null;
        }
        if (this.updatedLegalBranchObject.sign_document) {
            this.updatedLegalBranchObject.sign_document.file_path = null;
        }
        // this.updatedLegalEntityObject.sign_document.file_path = null;
        // this.updatedLegalBranchObject.sign_document.file_path = null;

        if (this.fileUpload) {
            this.fileUpload.clear();
        }

        if (this.fileUploadTwo) {
            this.fileUploadTwo.clear();
        }

        if (this.fileUploadUpdateOne) {
            this.fileUploadUpdateOne.clear();
        }

        if (this.fileUploadUpdateTwo) {
            this.fileUploadUpdateTwo.clear();
        }
    }
}
